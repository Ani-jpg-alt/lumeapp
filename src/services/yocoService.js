import { usePopup, useEFT } from '@lekkercommerce/yoco-react';

export const YOCO_CONFIG = {
  // Yoco Sandbox Public Key from environment variables
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY || 'pk_test_ed3c54a6gOol69qa7f45',
  // Sandbox environment settings
  environment: 'sandbox',
  // Currency settings
  currency: 'ZAR',
  // API endpoints
  baseUrl: 'https://payments-sandbox.yoco.com'
};

export const useYocoPopup = () => {
  const [showPopup, isYocoReady] = usePopup(YOCO_CONFIG.publicKey);

  return {
    showPopup,
    isYocoReady
  };
};

export const useYocoEFT = () => {
  const [showEFT, isYocoReady] = useEFT(YOCO_CONFIG.publicKey);

  return {
    showEFT,
    isYocoReady
  };
};

// Create a payment intent via independent payment server
export const createYocoPaymentIntent = async (orderId, items, deliveryDetails, totalAmount) => {
  try {
    const serverUrl = process.env.REACT_APP_PAYMENT_SERVER_URL || 'https://lumeserver.onrender.com';

    const paymentRequest = {
      amount: totalAmount,
      currency: YOCO_CONFIG.currency,
      reference: orderId,
      customerEmail: deliveryDetails.email,
      customerName: deliveryDetails.name,
      description: `Order ${orderId} - ${items.length} items`,
      successUrl: `${window.location.origin}/order-success/${orderId}`,
      cancelUrl: `${window.location.origin}/checkout`,
      failureUrl: `${window.location.origin}/checkout?error=payment_failed`,
      metadata: {
        orderId: orderId,
        itemCount: items.length,
        customerPhone: deliveryDetails.phone,
        source: 'lumeapp'
      }
    };

    console.log('Creating payment intent via server:', paymentRequest);

    const response = await fetch(`${serverUrl}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create payment intent');
    }

    console.log('Payment intent created:', result.data);
    return result.data;

  } catch (error) {
    console.error('Error creating Yoco payment intent:', error);
    throw new Error('Failed to create payment intent: ' + error.message);
  }
};

export const createYocoPayment = async (orderId, items, deliveryDetails, totalAmount) => {
  try {
    const paymentData = {
      // Amount in cents (Yoco requires amount in cents)
      amountInCents: Math.round(totalAmount * 100),
      currency: YOCO_CONFIG.currency,
      metadata: {
        orderId: orderId,
        customerName: deliveryDetails.name,
        customerEmail: deliveryDetails.email,
        customerPhone: deliveryDetails.phone,
        itemCount: items.length
      }
    };

    return paymentData;
  } catch (error) {
    console.error('Error creating Yoco payment:', error);
    throw new Error('Failed to create payment');
  }
};

// Payment status checker for sandbox environment
export const checkPaymentStatus = (paymentId) => {
  return new Promise((resolve) => {
    // In sandbox mode, simulate payment processing time
    setTimeout(() => {
      // Simulate successful payment for demo
      resolve({
        status: 'successful',
        paymentId: paymentId,
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
};

// Test card numbers for sandbox environment
export const YOCO_TEST_CARDS = {
  visa: {
    number: '4000000000000002',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    description: 'Visa test card (successful payment)'
  },
  mastercard: {
    number: '5200000000000007',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    description: 'Mastercard test card (successful payment)'
  },
  declined: {
    number: '4000000000000010',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    description: 'Test card (payment will be declined)'
  }
};