# Yoco Sandbox Environment Setup

This document outlines the Yoco payment gateway sandbox environment setup for the Lume App.

## Overview

The Yoco sandbox environment has been successfully configured to allow testing of card payments in a safe environment. The integration uses the official `@lekkercommerce/yoco-react` package for seamless React integration.

## Configuration

### Environment Details
- **Environment**: Sandbox
- **Public Key**: `pk_test_ed3c54a6gOol69qa7f45`
- **Currency**: ZAR (South African Rand)
- **Integration Type**: Popup Modal

### Package Installation
```bash
npm install @lekkercommerce/yoco-react --save
```

## Implementation

### Service File Location
- **File**: `src/services/yocoService.js`
- **Contains**: Configuration, hooks, and utility functions for Yoco integration

### Components Updated
- `src/components/Checkout.js` - Modal checkout component
- `src/pages/Checkout.js` - Full page checkout component

## Testing

### Test Card Numbers

Use these test card numbers in the Yoco payment modal:

#### Successful Payments
- **Visa**: `4000000000000002`
- **Mastercard**: `5200000000000007`

#### Failed Payments
- **Declined Card**: `4000000000000010`

### Test Card Details
- **Expiry**: Any future date (e.g., 12/2025)
- **CVV**: Any 3-digit number (e.g., 123)
- **Name**: Any name

## Features

### Payment Flow
1. User selects Yoco as payment method
2. Fills out delivery details
3. Clicks "Pay" button
4. Yoco payment modal opens
5. User enters test card details
6. Payment is processed
7. User is redirected to success page

### Error Handling
- Payment failures are handled gracefully
- Users can close the modal and retry
- Clear error messages are displayed

### Security
- All sensitive operations happen through Yoco's secure infrastructure
- Only public keys are used in frontend code
- Payment data is handled by Yoco, not stored locally

## Webhook Integration (Future)

For production, you'll need to implement webhook endpoints:
- **Webhook URL**: `/api/yoco-webhook`
- **Purpose**: Handle payment confirmations and status updates

## Environment Variables (Production)

For production deployment, store sensitive keys as environment variables:
```
REACT_APP_YOCO_PUBLIC_KEY_LIVE=pk_live_your_live_key_here
REACT_APP_YOCO_PUBLIC_KEY_TEST=pk_test_ed3c54a6gOol69qa7f45
```

## Support

For any issues with Yoco integration:
- **Email**: developers@yoco.com
- **Documentation**: https://developer.yoco.com/
- **Test Environment**: Always use sandbox keys for testing

## Next Steps

1. Test the integration thoroughly with various card scenarios
2. Implement webhook handling for payment confirmations
3. Set up production keys when ready to go live
4. Add additional payment methods if needed (EFT, etc.)

## Status

✅ Sandbox environment configured
✅ React components updated
✅ Test cards documented
✅ Error handling implemented
⏳ Ready for testing