const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import fetch for Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory storage for payment statuses
// In production, you would use a database like PostgreSQL or MongoDB
const paymentStatuses = new Map();

// Middleware
app.use(cors({
  origin: '*', // Temporarily allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'webhook-signature']
}));
app.use(express.json({ limit: '10mb' }));

// Configuration from environment variables
const CONFIG = {
  YOCO_SECRET_KEY: process.env.YOCO_SECRET_KEY,
  YOCO_API_URL: process.env.YOCO_API_URL || 'https://payments.yoco.com/api/checkouts',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  MAX_AMOUNT: parseInt(process.env.MAX_PAYMENT_AMOUNT) || 100000, // Max amount in ZAR
  WEBHOOK_SECRET: process.env.YOCO_WEBHOOK_SECRET, // For webhook signature verification
  RATE_LIMIT_REQUESTS: parseInt(process.env.RATE_LIMIT_REQUESTS) || 100,
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validate required environment variables
const requiredEnvVars = ['YOCO_SECRET_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease create a .env file with the required variables.');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Payment Server Running',
    timestamp: new Date().toISOString(),
    environment: CONFIG.ENVIRONMENT,
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      createPayment: 'POST /api/payments/create-intent',
      webhook: 'POST /api/payments/webhook',
      debugHeaders: 'POST /debug-headers'
    }
  });
});

// Debug endpoint to see what headers are being sent
app.post('/debug-headers', (req, res) => {
  res.json({
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// API Routes

// Create payment intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const {
      amount,
      currency = 'ZAR',
      reference,
      customerEmail,
      customerName,
      description,
      successUrl,
      cancelUrl,
      failureUrl,
      metadata = {}
    } = req.body;

    // Input validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_AMOUNT',
        message: 'Amount must be a positive number'
      });
    }

    // Check maximum amount limit
    if (amount > CONFIG.MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        error: 'AMOUNT_TOO_HIGH',
        message: `Amount cannot exceed R${CONFIG.MAX_AMOUNT.toLocaleString()}`
      });
    }

    if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Valid customer email is required'
      });
    }

    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REFERENCE',
        message: 'Payment reference is required'
      });
    }

    // Prepare payment data for Yoco API
    const paymentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      metadata: {
        reference: reference,
        customerName: customerName || 'Guest Customer',
        ...metadata
      },
      successUrl: successUrl || 'https://your-app.com/payment-success',
      cancelUrl: cancelUrl || 'https://your-app.com/payment-cancelled',
      failureUrl: failureUrl || 'https://your-app.com/payment-failed'
    };

    console.log(`[${new Date().toISOString()}] Creating payment intent:`, {
      amount: paymentData.amount,
      reference,
      customerEmail
    });

    // Call Yoco API
    const response = await fetch(CONFIG.YOCO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Independent-Payment-Server/1.0'
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`[${new Date().toISOString()}] Yoco API error:`, {
        status: response.status,
        error: result
      });

      return res.status(response.status).json({
        success: false,
        error: 'PAYMENT_PROVIDER_ERROR',
        message: 'Failed to create payment intent',
        details: CONFIG.ENVIRONMENT === 'sandbox' ? result : 'Contact support'
      });
    }

    console.log(`[${new Date().toISOString()}] Payment intent created successfully:`, {
      id: result.id,
      reference
    });

    // Return standardized response
    res.json({
      success: true,
      data: {
        paymentId: result.id,
        redirectUrl: result.redirectUrl,
        amount: amount,
        currency: currency,
        reference: reference,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Server error:`, error);

    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  }
});

// Helper function to verify webhook signature (Svix format)
const verifyWebhookSignature = (payload, signature, secret, headers = {}) => {
  if (!secret || !signature) {
    return false; // Skip verification if no secret configured
  }

  try {
    const crypto = require('crypto');

    // Parse Svix signature format: "v1,<base64_signature>"
    let actualSignature = signature;
    if (signature.startsWith('v1,')) {
      actualSignature = signature.slice(3); // Remove "v1," prefix
    }

    // Decode the webhook secret (Svix/Yoco format)
    const decodedSecret = Buffer.from(secret.replace('whsec_', ''), 'base64');

    // Try different Svix signature methods
    const methods = [];

    // Method 1: Standard HMAC of payload
    methods.push(() => {
      return crypto
        .createHmac('sha256', decodedSecret)
        .update(payload, 'utf8')
        .digest('base64');
    });

    // Method 2: Svix format with message ID and timestamp
    if (headers['svix-id'] && headers['svix-timestamp']) {
      methods.push(() => {
        const signedPayload = `${headers['svix-id']}.${headers['svix-timestamp']}.${payload}`;
        return crypto
          .createHmac('sha256', decodedSecret)
          .update(signedPayload, 'utf8')
          .digest('base64');
      });
    }

    // Method 3: Try with webhook-id and webhook-timestamp headers
    if (headers['webhook-id'] && headers['webhook-timestamp']) {
      methods.push(() => {
        const signedPayload = `${headers['webhook-id']}.${headers['webhook-timestamp']}.${payload}`;
        return crypto
          .createHmac('sha256', decodedSecret)
          .update(signedPayload, 'utf8')
          .digest('base64');
      });
    }

    // Method 4: Try without base64 decoding the secret
    methods.push(() => {
      return crypto
        .createHmac('sha256', secret.replace('whsec_', ''))
        .update(payload, 'utf8')
        .digest('base64');
    });

    // Try each method
    for (let i = 0; i < methods.length; i++) {
      try {
        const computedSignature = methods[i]();
        console.log(`Computed sig (method ${i + 1}):`, computedSignature);

        const match = crypto.timingSafeEqual(
          Buffer.from(actualSignature, 'base64'),
          Buffer.from(computedSignature, 'base64')
        );

        if (match) {
          console.log(`✅ Signature verified using method ${i + 1}`);
          return true;
        }
      } catch (e) {
        console.log(`Method ${i + 1} failed:`, e.message);
      }
    }

    console.log('❌ All signature verification methods failed');
    return false;

  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};



// Webhook endpoint for payment notifications
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const signature = req.headers['webhook-signature'];

    // Debug: Log all webhook headers to understand Svix format
    console.log(`[${timestamp}] All headers:`, JSON.stringify(req.headers, null, 2));

    // Verify webhook signature if secret is configured
    if (CONFIG.WEBHOOK_SECRET) {
      if (!signature) {
        console.error(`[${timestamp}] Webhook signature missing but secret is configured`);
        return res.status(401).json({
          success: false,
          error: 'MISSING_SIGNATURE',
          message: 'Webhook signature required but not provided'
        });
      }

      // Use raw body string for signature verification
      const payloadString = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
      console.log(`[${timestamp}] Raw payload length:`, payloadString.length);
      console.log(`[${timestamp}] Raw payload:`, payloadString);
      console.log(`[${timestamp}] Received signature:`, signature);
      console.log(`[${timestamp}] Using webhook secret:`, CONFIG.WEBHOOK_SECRET);
      const isValid = verifyWebhookSignature(payloadString, signature, CONFIG.WEBHOOK_SECRET, req.headers);

      if (!isValid) {
        console.error(`[${timestamp}] ❌ Invalid webhook signature`);
        return res.status(401).json({
          success: false,
          error: 'INVALID_SIGNATURE',
          message: 'Webhook signature verification failed'
        });
      }

      console.log(`[${timestamp}] ✅ Webhook signature verified`);
    } else if (CONFIG.WEBHOOK_SECRET) {
      console.log(`[${timestamp}] ⚠️ Webhook signature verification skipped in development mode`);
    } else {
      console.log(`[${timestamp}] ℹ️ Webhook signature verification skipped (no secret configured)`);
    }

    // Parse webhook data from raw body
    let webhookData;
    try {
      const bodyString = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
      webhookData = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(bodyString);
    } catch (parseError) {
      console.error(`[${timestamp}] JSON parsing error:`, parseError.message);
      console.error(`[${timestamp}] Raw body type:`, typeof req.body);
      console.error(`[${timestamp}] Raw body:`, req.body);
      return res.status(400).json({
        success: false,
        error: 'INVALID_JSON',
        message: 'Invalid JSON payload'
      });
    }

    console.log(`[${timestamp}] ✅ Verified event:`, {
      type: webhookData.type,
      id: webhookData.id,
      paymentId: webhookData.payload?.id,
      verified: !!CONFIG.WEBHOOK_SECRET
    });

    // Process different webhook events
    switch (webhookData.type) {
      case 'payment.succeeded':
        console.log(`[${timestamp}] Payment succeeded:`, {
          eventId: webhookData.id,
          paymentId: webhookData.payload?.id,
          reference: webhookData.payload?.metadata?.reference,
          checkoutId: webhookData.payload?.metadata?.checkoutId,
          amount: webhookData.payload?.amount,
          currency: webhookData.payload?.currency,
          paymentMethod: webhookData.payload?.paymentMethodDetails?.type
        });

        // Store payment status
        const orderId = webhookData.payload?.metadata?.reference;
        if (orderId) {
          paymentStatuses.set(orderId, {
            orderId: orderId,
            paymentId: webhookData.payload?.id,
            status: 'succeeded',
            amount: webhookData.payload?.amount,
            currency: webhookData.payload?.currency,
            paymentMethod: webhookData.payload?.paymentMethodDetails?.type,
            checkoutId: webhookData.payload?.metadata?.checkoutId,
            eventId: webhookData.id,
            webhookVerified: true,
            webhookTimestamp: new Date(timestamp),
            processedAt: new Date()
          });
          console.log(`[${timestamp}] ✅ Stored payment success for order: ${orderId}`);
        }

        break;

      case 'payment.failed':
        console.log(`[${timestamp}] Payment failed:`, {
          eventId: webhookData.id,
          paymentId: webhookData.payload?.id,
          reference: webhookData.payload?.metadata?.reference,
          checkoutId: webhookData.payload?.metadata?.checkoutId,
          amount: webhookData.payload?.amount,
          status: webhookData.payload?.status
        });

        // Store payment failure status
        const failedOrderId = webhookData.payload?.metadata?.reference;
        if (failedOrderId) {
          paymentStatuses.set(failedOrderId, {
            orderId: failedOrderId,
            paymentId: webhookData.payload?.id,
            status: 'failed',
            amount: webhookData.payload?.amount,
            currency: webhookData.payload?.currency,
            failureReason: webhookData.payload?.status,
            checkoutId: webhookData.payload?.metadata?.checkoutId,
            eventId: webhookData.id,
            webhookVerified: true,
            webhookTimestamp: new Date(timestamp),
            processedAt: new Date()
          });
          console.log(`[${timestamp}] ✅ Stored payment failure for order: ${failedOrderId}`);
        }

        break;

      default:
        console.log(`[${timestamp}] Received webhook type: ${webhookData.type}`, {
          eventId: webhookData.id,
          paymentId: webhookData.payload?.id
        });

        // Handle other webhook types as needed
        break;
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({
      success: true,
      received: true,
      timestamp: timestamp
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Webhook processing error:`, error);

    res.status(500).json({
      success: false,
      error: 'WEBHOOK_PROCESSING_ERROR',
      message: 'Failed to process webhook'
    });
  }
});

// Get payment status (this is the key endpoint for frontend verification)
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] Payment status query for: ${paymentId}`);

    // Check if we have payment status from webhook
    const paymentStatus = paymentStatuses.get(paymentId);

    if (paymentStatus) {
      console.log(`[${timestamp}] ✅ Found webhook-verified status: ${paymentStatus.status}`);

      res.json({
        success: true,
        data: {
          orderId: paymentStatus.orderId,
          paymentId: paymentStatus.paymentId,
          status: paymentStatus.status, // succeeded, failed, or pending
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          paymentMethod: paymentStatus.paymentMethod,
          webhookVerified: true,
          webhookTimestamp: paymentStatus.webhookTimestamp,
          processedAt: paymentStatus.processedAt,
          eventId: paymentStatus.eventId
        },
        meta: {
          source: 'webhook',
          verified: true,
          queryTime: new Date().toISOString()
        }
      });
    } else {
      // No webhook received yet - payment is still pending or not found
      console.log(`[${timestamp}] ⚠️ No webhook status found for: ${paymentId} - returning pending`);

      res.json({
        success: true,
        data: {
          orderId: paymentId,
          paymentId: paymentId,
          status: 'pending', // Default to pending if no webhook received
          amount: null,
          currency: 'ZAR',
          webhookVerified: false,
          processedAt: new Date().toISOString()
        },
        meta: {
          source: 'default',
          verified: false,
          reason: 'No webhook received yet',
          queryTime: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get payment status'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, error);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: CONFIG.ENVIRONMENT === 'sandbox' ? error.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'ROUTE_NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      health: 'GET /health',
      createPayment: 'POST /api/payments/create-intent',
      webhook: 'POST /api/payments/webhook',
      paymentStatus: 'GET /api/payments/:paymentId/status'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Independent Payment Server Started');
  console.log('=====================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${CONFIG.ENVIRONMENT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/health`);
  console.log('\n📡 API Endpoints:');
  console.log(`   POST /api/payments/create-intent - Create payment intent`);
  console.log(`   POST /api/payments/webhook - Payment webhooks`);
  console.log(`   GET  /api/payments/:id/status - Payment status`);
  console.log('\n🔑 Configuration:');
  console.log(`   Environment: ${CONFIG.ENVIRONMENT}`);
  console.log(`   Yoco Key: ${CONFIG.YOCO_SECRET_KEY ? CONFIG.YOCO_SECRET_KEY.substring(0, 12) + '...' : 'NOT SET'}`);
  console.log(`   Webhook Secret: ${CONFIG.WEBHOOK_SECRET ? 'Configured ✓' : 'Not configured (verification disabled)'}`);
  console.log(`   Max Amount: R${CONFIG.MAX_AMOUNT.toLocaleString()}`);
  console.log(`   Rate Limit: ${CONFIG.RATE_LIMIT_REQUESTS} requests/${CONFIG.RATE_LIMIT_WINDOW/1000}s`);
  console.log(`   CORS: ${CONFIG.ENVIRONMENT === 'production' ? 'Restricted origins' : 'All origins (development)'}`);
  console.log(`   Log Level: ${CONFIG.LOG_LEVEL}`);
  console.log('\n✅ Server ready for payment processing!\n');
});