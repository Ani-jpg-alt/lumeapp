# Payment Server Setup Guide

This guide will help you set up the backend payment server to handle real Yoco payment intents.

## Prerequisites

- Node.js installed (version 14 or higher)
- Your Yoco test credentials from the .env file

## Quick Setup

### 1. Install Server Dependencies

```bash
# Create a new terminal/command prompt window
# Navigate to your project directory
cd C:\Users\sphll\Desktop\lumeapp2\lumeapp

# Install server dependencies
npm install express cors node-fetch dotenv nodemon
```

### 2. Start the Payment Server

```bash
# Start the server (will run on port 3001)
node server.js
```

**OR** for development with auto-restart:

```bash
# Install nodemon globally if you haven't
npm install -g nodemon

# Start with nodemon
nodemon server.js
```

### 3. Verify Server is Running

Open your browser and go to: `http://localhost:3001/health`

You should see:
```json
{
  "status": "Server is running",
  "timestamp": "2025-09-21T...",
  "environment": "sandbox"
}
```

## Running Both Services

You'll need **TWO terminal windows**:

### Terminal 1 - React App
```bash
cd C:\Users\sphll\Desktop\lumeapp2\lumeapp
npm start
# Runs on http://localhost:3000
```

### Terminal 2 - Payment Server
```bash
cd C:\Users\sphll\Desktop\lumeapp2\lumeapp
node server.js
# Runs on http://localhost:3001
```

## How It Works

1. **Frontend** (React app on port 3000) creates orders and cart data
2. **Backend** (Node.js server on port 3001) handles Yoco payment intents
3. **Yoco** provides hosted payment pages for secure card processing

## Testing the Real Yoco Integration

1. Add items to cart
2. Go to checkout
3. Select "Yoco (Sandbox)" payment method
4. Fill in delivery details
5. Click "Pay" - you'll be redirected to Yoco's payment page
6. Use test card numbers:
   - **Visa Success**: `4000000000000002`
   - **Mastercard Success**: `5200000000000007`
   - **Declined**: `4000000000000010`
   - **Expiry**: Any future date (e.g., 12/2025)
   - **CVV**: Any 3 digits (e.g., 123)

## Server Endpoints

- `GET /health` - Health check
- `POST /api/create-payment-intent` - Creates Yoco payment intent
- `POST /api/yoco-webhook` - Handles Yoco payment notifications
- `POST /api/payfast-webhook` - Handles PayFast notifications

## Environment Variables

The server uses these from your `.env` file:
- `REACT_APP_YOCO_SECURITY_KEY` - Your Yoco secret key
- `PORT` - Server port (defaults to 3001)

## Troubleshooting

### Server won't start
- Make sure port 3001 is available
- Check that all dependencies are installed
- Verify your .env file has the Yoco secret key

### Payment creation fails
- Check server logs for error messages
- Verify your Yoco secret key is correct
- Ensure the server is running on port 3001

### Frontend can't connect to server
- Confirm server is running on http://localhost:3001
- Check browser console for CORS errors
- Verify the frontend is making requests to the correct URL

## Production Deployment

For production:
1. Deploy the server to a hosting service (Heroku, Railway, etc.)
2. Update `REACT_APP_SERVER_URL` environment variable
3. Use live Yoco keys instead of sandbox keys
4. Set up proper webhook URLs in Yoco dashboard

## Security Notes

- Never expose your Yoco secret key in frontend code
- Always validate payments on the server side
- Implement proper webhook signature verification in production
- Use HTTPS in production for all payment-related communications