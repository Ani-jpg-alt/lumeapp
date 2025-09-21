# Postman Testing Guide for Payment API

This guide shows you how to test your payment server API endpoints using Postman.

## Prerequisites

1. **Start your payment server**:
   ```bash
   node server.js
   # Server should be running on http://localhost:3001
   ```

2. **Install Postman**: Download from [postman.com](https://www.postman.com/downloads/)

## 🧪 API Endpoint Tests

### 1. Health Check
**Test that your server is running**

```http
GET http://localhost:3001/health
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3001/health`
- Headers: None needed

**Expected Response (200 OK):**
```json
{
  "status": "Payment Server Running",
  "timestamp": "2025-09-21T...",
  "environment": "development",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "createPayment": "POST /api/payments/create-intent",
    "webhook": "POST /api/payments/webhook"
  }
}
```

---

### 2. Create Payment Intent
**Test creating a Yoco payment intent**

```http
POST http://localhost:3001/api/payments/create-intent
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3001/api/payments/create-intent`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "amount": 99.99,
    "currency": "ZAR",
    "reference": "TEST_ORDER_123",
    "customerEmail": "test@example.com",
    "customerName": "John Doe",
    "description": "Test payment for 3 items",
    "successUrl": "http://localhost:3000/payment-success",
    "cancelUrl": "http://localhost:3000/checkout",
    "failureUrl": "http://localhost:3000/payment-failed",
    "metadata": {
      "orderId": "ORDER_123",
      "userId": "USER_456",
      "testMode": true
    }
  }
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pi_yoco_generated_id",
    "redirectUrl": "https://checkout.yoco.com/payment/pi_...",
    "amount": 99.99,
    "currency": "ZAR",
    "reference": "TEST_ORDER_123",
    "status": "pending"
  }
}
```

**Expected Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "INVALID_EMAIL",
  "message": "Valid customer email is required"
}
```

---

### 3. Test Payment Status
**Check status of a payment**

```http
GET http://localhost:3001/api/payments/pi_12345/status
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3001/api/payments/pi_12345/status`
- Headers: None needed

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pi_12345",
    "status": "pending",
    "amount": 0,
    "currency": "ZAR",
    "reference": "unknown",
    "createdAt": "2025-09-21T..."
  }
}
```

---

### 4. Test Webhook (Simulate Yoco Webhook)
**Simulate a webhook from Yoco**

```http
POST http://localhost:3001/api/payments/webhook
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3001/api/payments/webhook`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "type": "payment.succeeded",
    "id": "pi_test_12345",
    "amount": 9999,
    "currency": "ZAR",
    "status": "succeeded",
    "metadata": {
      "reference": "TEST_ORDER_123",
      "customerName": "John Doe"
    },
    "created": "2025-09-21T10:30:00.000Z"
  }
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "received": true,
  "timestamp": "2025-09-21T..."
}
```

---

## 🧪 Test Cases to Try

### Valid Test Cases

#### 1. **Minimum Valid Payment**
```json
{
  "amount": 1.00,
  "reference": "MIN_TEST",
  "customerEmail": "test@example.com"
}
```

#### 2. **Maximum Valid Payment**
```json
{
  "amount": 99999.99,
  "reference": "MAX_TEST",
  "customerEmail": "test@example.com"
}
```

#### 3. **Payment with All Fields**
```json
{
  "amount": 150.75,
  "currency": "ZAR",
  "reference": "FULL_TEST_789",
  "customerEmail": "customer@shop.com",
  "customerName": "Jane Smith",
  "description": "Complete test payment",
  "successUrl": "https://myapp.com/success",
  "cancelUrl": "https://myapp.com/cancel",
  "failureUrl": "https://myapp.com/failed",
  "metadata": {
    "orderId": "ORD_789",
    "userId": "USR_456",
    "items": ["item1", "item2"],
    "discount": 10.00
  }
}
```

### Error Test Cases

#### 1. **Missing Required Fields**
```json
{
  "amount": 50.00
  // Missing reference and customerEmail
}
```
**Expected**: `400 Bad Request` with error details

#### 2. **Invalid Amount**
```json
{
  "amount": -10.00,
  "reference": "NEGATIVE_TEST",
  "customerEmail": "test@example.com"
}
```
**Expected**: `400 Bad Request` - "Amount must be a positive number"

#### 3. **Amount Too High**
```json
{
  "amount": 999999.99,
  "reference": "TOO_HIGH_TEST",
  "customerEmail": "test@example.com"
}
```
**Expected**: `400 Bad Request` - "Amount cannot exceed R100,000"

#### 4. **Invalid Email**
```json
{
  "amount": 50.00,
  "reference": "BAD_EMAIL_TEST",
  "customerEmail": "not-an-email"
}
```
**Expected**: `400 Bad Request` - "Valid customer email is required"

#### 5. **Missing Reference**
```json
{
  "amount": 50.00,
  "customerEmail": "test@example.com"
  // Missing reference
}
```
**Expected**: `400 Bad Request` - "Payment reference is required"

---

## 🚀 Postman Collection Setup

### Quick Collection Import

1. **Create New Collection** in Postman called "Payment API Tests"

2. **Add Environment Variables**:
   - Go to Environments → Create new
   - Add variables:
     ```
     base_url: http://localhost:3001
     test_email: test@example.com
     test_amount: 99.99
     ```

3. **Use Variables in Requests**:
   - URL: `{{base_url}}/api/payments/create-intent`
   - Body: `"customerEmail": "{{test_email}}"`

### Pre-request Scripts

Add this to generate dynamic test data:

```javascript
// Generate random order ID
pm.environment.set("random_order_id", "TEST_" + Math.floor(Math.random() * 10000));

// Set timestamp
pm.environment.set("timestamp", new Date().toISOString());
```

### Test Scripts

Add this to automatically test responses:

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Test payment creation
pm.test("Payment intent created", function () {
    const jsonData = pm.response.json();
    if (jsonData.success) {
        pm.expect(jsonData.data).to.have.property('paymentId');
        pm.expect(jsonData.data).to.have.property('redirectUrl');
    }
});
```

---

## 🔍 Debugging Tips

### 1. **Check Server Logs**
Monitor your terminal running `node server.js` for detailed logs

### 2. **Common Issues**
- **Connection refused**: Server not running on port 3001
- **CORS errors**: Check `ALLOWED_ORIGINS` in your `.env`
- **Payment provider errors**: Invalid Yoco secret key

### 3. **Response Codes**
- `200`: Success
- `400`: Bad request (invalid data)
- `401`: Unauthorized (webhook signature failed)
- `404`: Route not found
- `500`: Server error

### 4. **Test Real Yoco Integration**
Once payment intent is created, you can:
1. Copy the `redirectUrl` from response
2. Open in browser
3. Use Yoco test cards:
   - **Success**: `4000000000000002`
   - **Decline**: `4000000000000010`

---

## 📋 Postman Collection JSON

<details>
<summary>Click to expand ready-to-import Postman collection</summary>

```json
{
  "info": {
    "name": "Payment API Tests",
    "description": "Test collection for payment server API"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Create Payment Intent",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": {{test_amount}},\n  \"currency\": \"ZAR\",\n  \"reference\": \"{{random_order_id}}\",\n  \"customerEmail\": \"{{test_email}}\",\n  \"customerName\": \"Test User\",\n  \"description\": \"Test payment\",\n  \"successUrl\": \"http://localhost:3000/success\",\n  \"cancelUrl\": \"http://localhost:3000/cancel\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/payments/create-intent",
          "host": ["{{base_url}}"],
          "path": ["api", "payments", "create-intent"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "test_email",
      "value": "test@example.com"
    },
    {
      "key": "test_amount",
      "value": "99.99"
    }
  ]
}
```

</details>

Save this as a `.json` file and import into Postman for instant testing! 🎉