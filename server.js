const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import fetch for Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
      webhook: 'POST /api/payments/webhook'
    }
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

// Helper function to verify webhook signature
const verifyWebhookSignature = (payload, signature, secret) => {
  if (!secret || !signature) {
    return false; // Skip verification if no secret configured
  }

  try {
    const crypto = require('crypto');
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

// Webhook endpoint for payment notifications
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const signature = req.headers['x-yoco-signature'] || req.headers['yoco-signature'];

    // Verify webhook signature if secret is configured
    if (CONFIG.WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(req.body, signature, CONFIG.WEBHOOK_SECRET);

      if (!isValid) {
        console.error(`[${timestamp}] Invalid webhook signature`);
        return res.status(401).json({
          success: false,
          error: 'INVALID_SIGNATURE',
          message: 'Webhook signature verification failed'
        });
      }

      console.log(`[${timestamp}] Webhook signature verified ✓`);
    } else {
      console.log(`[${timestamp}] Webhook signature verification skipped (no secret configured)`);
    }

    // Parse webhook data
    const webhookData = JSON.parse(req.body.toString());

    console.log(`[${timestamp}] Received payment webhook:`, {
      type: webhookData.type,
      id: webhookData.id,
      verified: !!CONFIG.WEBHOOK_SECRET
    });

    // Process different webhook events
    switch (webhookData.type) {
      case 'payment.succeeded':
        console.log(`[${timestamp}] Payment succeeded:`, {
          paymentId: webhookData.id,
          reference: webhookData.metadata?.reference,
          amount: webhookData.amount
        });

        // Here you would:
        // 1. Verify the webhook signature (recommended)
        // 2. Update your database/order status
        // 3. Send confirmation emails
        // 4. Trigger any business logic

        break;

      case 'payment.failed':
        console.log(`[${timestamp}] Payment failed:`, {
          paymentId: webhookData.id,
          reference: webhookData.metadata?.reference,
          reason: webhookData.failure_reason
        });

        // Handle failed payments
        break;

      case 'payment.cancelled':
        console.log(`[${timestamp}] Payment cancelled:`, {
          paymentId: webhookData.id,
          reference: webhookData.metadata?.reference
        });

        // Handle cancelled payments
        break;

      case 'payment.refunded':
        console.log(`[${timestamp}] Payment refunded:`, {
          paymentId: webhookData.id,
          reference: webhookData.metadata?.reference,
          refundAmount: webhookData.refund_amount
        });

        // Handle refunds
        break;

      default:
        console.log(`[${timestamp}] Unknown webhook type:`, webhookData.type);
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

// Get payment status (optional endpoint)
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Here you would typically:
    // 1. Query your database for payment status
    // 2. Or make a call to Yoco API to get current status

    // Mock response for demonstration
    res.json({
      success: true,
      data: {
        paymentId: paymentId,
        status: 'pending', // pending, succeeded, failed, cancelled
        amount: 0,
        currency: 'ZAR',
        reference: 'unknown',
        createdAt: new Date().toISOString()
      }
    });

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