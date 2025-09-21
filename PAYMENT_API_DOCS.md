# Independent Payment Server API Documentation

This is a standalone payment server that handles Yoco payment intents. It can be used with any frontend application through simple HTTP API calls.

## Server Overview

- **Framework**: Express.js
- **Payment Provider**: Yoco (South Africa)
- **Environment**: Sandbox/Production configurable
- **CORS**: Enabled for all origins (configure for production)

## Quick Start

### 1. Setup
```bash
# Install dependencies
npm install express cors node-fetch

# Update your Yoco secret key in server.js
# Line 18: YOCO_SECRET_KEY: 'your_actual_secret_key_here'

# Start server
node server.js
```

### 2. Server will run on `http://localhost:3001`

## API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "Payment Server Running",
  "timestamp": "2025-09-21T10:30:00.000Z",
  "environment": "sandbox",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "createPayment": "POST /api/payments/create-intent",
    "webhook": "POST /api/payments/webhook"
  }
}
```

---

### Create Payment Intent
```http
POST /api/payments/create-intent
```

**Request Body:**
```json
{
  "amount": 99.99,
  "currency": "ZAR",
  "reference": "ORDER_12345",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "description": "Order for 3 items",
  "successUrl": "https://your-app.com/payment-success",
  "cancelUrl": "https://your-app.com/payment-cancelled",
  "failureUrl": "https://your-app.com/payment-failed",
  "metadata": {
    "orderId": "ORDER_12345",
    "userId": "USER_789",
    "customField": "any_value"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pi_yoco_generated_id",
    "redirectUrl": "https://checkout.yoco.com/payment/pi_yoco_generated_id",
    "amount": 99.99,
    "currency": "ZAR",
    "reference": "ORDER_12345",
    "status": "pending"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "INVALID_AMOUNT",
  "message": "Amount must be a positive number"
}
```

---

### Payment Webhook
```http
POST /api/payments/webhook
```

This endpoint receives notifications from Yoco when payment status changes.

**Webhook Events:**
- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `payment.cancelled` - Payment cancelled by user
- `payment.refunded` - Payment was refunded

**Example Webhook Body:**
```json
{
  "type": "payment.succeeded",
  "id": "pi_yoco_generated_id",
  "amount": 9999,
  "currency": "ZAR",
  "metadata": {
    "reference": "ORDER_12345",
    "customerName": "John Doe"
  },
  "created": "2025-09-21T10:30:00.000Z"
}
```

---

### Get Payment Status
```http
GET /api/payments/:paymentId/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pi_yoco_generated_id",
    "status": "succeeded",
    "amount": 99.99,
    "currency": "ZAR",
    "reference": "ORDER_12345",
    "createdAt": "2025-09-21T10:30:00.000Z"
  }
}
```

## Frontend Integration Examples

### JavaScript/React
```javascript
// Create payment intent
const createPayment = async (orderData) => {
  try {
    const response = await fetch('http://localhost:3001/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.total,
        currency: 'ZAR',
        reference: orderData.orderId,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/checkout`,
        failureUrl: `${window.location.origin}/payment-failed`
      })
    });

    const result = await response.json();

    if (result.success) {
      // Redirect user to payment page
      window.location.href = result.data.redirectUrl;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Payment creation failed:', error);
  }
};
```

### PHP
```php
<?php
$paymentData = [
    'amount' => 99.99,
    'currency' => 'ZAR',
    'reference' => 'ORDER_12345',
    'customerEmail' => 'customer@example.com',
    'customerName' => 'John Doe',
    'successUrl' => 'https://your-app.com/success',
    'cancelUrl' => 'https://your-app.com/cancel'
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($paymentData)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents('http://localhost:3001/api/payments/create-intent', false, $context);
$response = json_decode($result, true);

if ($response['success']) {
    header('Location: ' . $response['data']['redirectUrl']);
    exit;
}
?>
```

### Python
```python
import requests
import json

def create_payment(order_data):
    payment_data = {
        'amount': order_data['total'],
        'currency': 'ZAR',
        'reference': order_data['order_id'],
        'customerEmail': order_data['customer_email'],
        'customerName': order_data['customer_name'],
        'successUrl': 'https://your-app.com/success',
        'cancelUrl': 'https://your-app.com/cancel'
    }

    response = requests.post(
        'http://localhost:3001/api/payments/create-intent',
        headers={'Content-Type': 'application/json'},
        data=json.dumps(payment_data)
    )

    result = response.json()

    if result['success']:
        return result['data']['redirectUrl']
    else:
        raise Exception(result['message'])
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_AMOUNT` | Amount must be positive number |
| `INVALID_EMAIL` | Customer email is required and must be valid |
| `MISSING_REFERENCE` | Payment reference is required |
| `PAYMENT_PROVIDER_ERROR` | Error from Yoco API |
| `INTERNAL_SERVER_ERROR` | Server error |
| `ROUTE_NOT_FOUND` | API endpoint not found |
| `WEBHOOK_PROCESSING_ERROR` | Webhook processing failed |

## Configuration

### Production Setup
1. **Update Secret Key**: Replace the hardcoded key with your live Yoco secret key
2. **Environment**: Change `ENVIRONMENT: 'production'`
3. **CORS**: Restrict origins to your actual domains
4. **HTTPS**: Deploy with SSL certificate
5. **Webhooks**: Configure webhook URL in Yoco dashboard

### Environment Variables (Optional)
```bash
PORT=3001
YOCO_SECRET_KEY=sk_live_your_live_key
ENVIRONMENT=production
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never expose secret key in frontend code**
2. **Always validate webhook signatures in production**
3. **Use HTTPS in production**
4. **Restrict CORS origins**
5. **Validate all input data**
6. **Log payment events for auditing**

## Deployment

### Railway/Heroku
```bash
# Add environment variables
YOCO_SECRET_KEY=your_secret_key
PORT=3001
ENVIRONMENT=production

# Deploy server.js and package.json
```

### VPS/Cloud Server
```bash
# Install Node.js
# Clone/upload server files
npm install
pm2 start server.js --name payment-server
```

## Testing

### Test with cURL
```bash
# Health check
curl http://localhost:3001/health

# Create payment intent
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10.00,
    "currency": "ZAR",
    "reference": "TEST_123",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "successUrl": "https://example.com/success"
  }'
```

### Yoco Test Cards
- **Success**: `4000000000000002` (Visa)
- **Success**: `5200000000000007` (Mastercard)
- **Decline**: `4000000000000010`
- **Expiry**: Any future date
- **CVV**: Any 3 digits

## Support

This is a standalone payment server that demonstrates how to integrate with Yoco's payment API. Modify as needed for your specific requirements.