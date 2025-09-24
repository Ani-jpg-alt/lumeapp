import { updateOrderStatus, getOrder } from './firestoreService';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const PAYMENT_SERVER_URL = process.env.REACT_APP_PAYMENT_SERVER_URL || 'https://lumeserver.onrender.com';

// Firebase collections
const paymentStatusCollection = collection(db, 'paymentStatuses');
const paymentLogsCollection = collection(db, 'paymentLogs');

export const paymentWebhookService = {

  // Log payment verification attempts
  async logPaymentVerification(orderId, action, data, success = true, error = null) {
    try {
      await addDoc(paymentLogsCollection, {
        orderId,
        action,
        data,
        success,
        error: error?.message || null,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (logError) {
      // console.error('Failed to log payment verification:', logError);
    }
  },

  // Verify payment status with server (the main method)
  async verifyPaymentStatus(orderId) {
    const logData = { orderId, serverUrl: PAYMENT_SERVER_URL };

    try {
      // console.log(`🔍 Verifying payment status for order: ${orderId}`);
      await this.logPaymentVerification(orderId, 'VERIFY_PAYMENT_START', logData);

      // First check if order exists locally
      const order = await getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found in local database`);
      }

      console.log(`📋 Local order status: ${order.status}`);

      // Query payment server for verified status
      const response = await fetch(`${PAYMENT_SERVER_URL}/api/payments/${orderId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LumeApp-Frontend/1.0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const serverData = await response.json();
      console.log('🔍 Server response:', serverData);

      // Extract payment status from server response
      const serverStatus = this.extractPaymentStatus(serverData);
      console.log(`💳 Server payment status: ${serverStatus}`);

      // Store server response in Firebase for audit trail
      const verificationResult = {
        orderId,
        serverResponse: serverData,
        serverStatus,
        localOrderStatus: order.status,
        verificationTime: new Date(),
        verified: true,
        source: 'server_verification'
      };

      await setDoc(doc(paymentStatusCollection, orderId), verificationResult);

      // Update local order status if server has different status
      if (serverStatus && serverStatus !== order.status) {
        console.log(`🔄 Status sync needed: Local='${order.status}' → Server='${serverStatus}'`);

        await updateOrderStatus(orderId, serverStatus);

        await this.logPaymentVerification(orderId, 'STATUS_SYNC', {
          fromStatus: order.status,
          toStatus: serverStatus,
          serverData
        });

        console.log(`✅ Order ${orderId} status updated to: ${serverStatus}`);
      } else {
        console.log(`✅ Order ${orderId} status already correct: ${order.status}`);
      }

      await this.logPaymentVerification(orderId, 'VERIFY_PAYMENT_SUCCESS', verificationResult);

      return {
        orderId,
        verified: true,
        status: serverStatus || order.status,
        localStatus: order.status,
        serverStatus,
        synced: serverStatus === order.status,
        verificationTime: new Date(),
        serverData
      };

    } catch (error) {
      console.error('❌ Payment verification failed:', error);

      await this.logPaymentVerification(orderId, 'VERIFY_PAYMENT_FAILED', logData, false, error);

      // On error, return local status but mark as unverified
      try {
        const order = await getOrder(orderId);
        return {
          orderId,
          verified: false,
          status: order.status,
          localStatus: order.status,
          serverStatus: null,
          synced: false,
          error: error.message,
          fallbackToLocal: true
        };
      } catch (localError) {
        throw new Error(`Payment verification failed and order not found locally: ${error.message}`);
      }
    }
  },

  // Extract payment status from various server response formats
  extractPaymentStatus(serverData) {
    // Try different possible response structures
    if (serverData.data?.status) {
      return this.normalizeStatus(serverData.data.status);
    }

    if (serverData.status) {
      return this.normalizeStatus(serverData.status);
    }

    if (serverData.payment?.status) {
      return this.normalizeStatus(serverData.payment.status);
    }

    // console.warn('Could not extract payment status from server response:', serverData);
    return null;
  },

  // Normalize different status formats to consistent values
  normalizeStatus(status) {
    const statusMap = {
      'succeeded': 'paid',
      'successful': 'paid',
      'completed': 'paid',
      'paid': 'paid',
      'failed': 'failed',
      'cancelled': 'failed',
      'canceled': 'failed',
      'pending': 'pending'
    };

    return statusMap[status?.toLowerCase()] || status;
  },

  // Poll for payment status updates (for pending payments)
  async pollPaymentStatus(orderId, maxAttempts = 12, intervalMs = 5000) {
    // console.log(`🔄 Starting payment status polling for order: ${orderId}`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // console.log(`📡 Poll attempt ${attempt}/${maxAttempts}`);

        const result = await this.verifyPaymentStatus(orderId);

        // Stop polling if payment is no longer pending
        if (result.status !== 'pending') {
          // console.log(`✅ Payment status resolved: ${result.status}`);
          return result;
        }

        // Wait before next attempt (unless it's the last attempt)
        if (attempt < maxAttempts) {
          // console.log(`⏳ Waiting ${intervalMs/1000}s before next poll...`);
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }

      } catch (error) {
        // console.error(`❌ Poll attempt ${attempt} failed:`, error);

        // On last attempt, throw error
        if (attempt === maxAttempts) {
          throw error;
        }

        // Otherwise, wait and try again
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    throw new Error(`Payment status polling timed out after ${maxAttempts} attempts`);
  },

  // Get stored payment status from Firebase (for audit/debugging)
  async getStoredPaymentStatus(orderId) {
    try {
      const docRef = doc(paymentStatusCollection, orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      // console.error('Error getting stored payment status:', error);
      throw error;
    }
  },

  // Check if payment is verified and ready to display
  async isPaymentVerified(orderId) {
    try {
      const storedStatus = await this.getStoredPaymentStatus(orderId);

      if (!storedStatus) {
        return { verified: false, reason: 'No verification record found' };
      }

      const verificationAge = new Date() - new Date(storedStatus.verificationTime.seconds * 1000);
      const maxAge = 5 * 60 * 1000; // 5 minutes

      if (verificationAge > maxAge) {
        return { verified: false, reason: 'Verification is stale', age: verificationAge };
      }

      return {
        verified: true,
        status: storedStatus.serverStatus || storedStatus.localOrderStatus,
        verificationTime: storedStatus.verificationTime
      };
    } catch (error) {
      // console.error('Error checking payment verification:', error);
      return { verified: false, reason: error.message };
    }
  }
};

export default paymentWebhookService;