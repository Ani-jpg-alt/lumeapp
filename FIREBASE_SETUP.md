# Firebase E-commerce Setup Guide

This guide will help you set up Firebase Authentication and Firestore for your e-commerce application.

## 1. Firebase Project Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "lumeapp-ecommerce")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

### Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 2. Firebase Configuration

### Get Firebase Config
1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Update Firebase Config
Replace the placeholder values in `src/firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 3. Firestore Security Rules

Update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - readable by all, writable by admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admin can write (you'll need to implement admin auth)
    }
    
    // Orders collection - users can only access their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 4. Seed Sample Data

### Option 1: Using the Seed Script
1. Open your browser's developer console
2. Import and run the seed function:

```javascript
// In browser console
import { seedProducts } from './src/scripts/seedProducts.js';
seedProducts();
```

### Option 2: Manual Firestore Setup
1. Go to Firestore Database in Firebase Console
2. Create a collection called "products"
3. Add documents with the following structure:

```javascript
// Document ID: auto-generated
{
  name: "Jean Dress",
  description: "A beautiful denim dress perfect for any occasion.",
  price: 300,
  imageUrl: "/jean-dress.JPG",
  images: ["/jean-dress.JPG", "/jean-dress-2.JPG", "/jean-dress-3.JPG"],
  category: "dresses",
  sizes: ["S", "M", "L", "XL", "XXL"],
  inStock: true
}
```

## 5. Payment Gateway Setup

### PayFast Sandbox
- **Merchant ID**: `10000100` (sandbox)
- **Merchant Key**: `46f0cd694581a` (sandbox)
- **Test URL**: `https://sandbox.payfast.co.za/eng/process`
- **Test Card**: `4000000000000002` (Visa)

### Yoco Sandbox
- **Public Key**: `pk_test_ed3c54a6gOol69qa7f45` (sandbox)
- **Test Card**: `4000000000000002` (Visa)

## 6. Firestore Collections Schema

### Products Collection
```javascript
{
  id: "auto-generated",
  name: "string",
  description: "string", 
  price: "number",
  imageUrl: "string",
  images: ["string"],
  category: "string",
  sizes: ["string"],
  inStock: "boolean"
}
```

### Orders Collection
```javascript
{
  id: "auto-generated",
  userId: "string (Firebase UID)",
  productId: "string",
  productName: "string",
  productPrice: "string",
  amount: "number",
  gateway: "payfast" | "yoco",
  status: "pending" | "paid" | "failed",
  deliveryDetails: {
    name: "string",
    email: "string", 
    phone: "string",
    address: "string",
    city: "string",
    postalCode: "string"
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 7. Testing the Application

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Test Flow
1. Navigate to `/auth` to create an account or sign in
2. Go to `/shop` to view products
3. Click "Buy Now" on any product
4. Fill out the checkout form
5. Select payment method (PayFast or Yoco)
6. Complete the sandbox payment
7. View order confirmation

## 8. Production Considerations

### Security Rules
- Update Firestore rules for production
- Implement proper admin authentication
- Add input validation and sanitization

### Payment Integration
- Replace sandbox credentials with production keys
- Implement proper webhook handling
- Add payment status verification

### Error Handling
- Add comprehensive error boundaries
- Implement retry mechanisms
- Add user-friendly error messages

### Performance
- Implement pagination for products
- Add image optimization
- Use Firebase caching strategies

## 9. Troubleshooting

### Common Issues
1. **Firebase config errors**: Ensure all config values are correct
2. **Permission denied**: Check Firestore security rules
3. **Authentication issues**: Verify email/password is enabled
4. **Products not loading**: Check if products collection exists and has data

### Debug Mode
Enable Firebase debug mode in browser console:
```javascript
localStorage.setItem('firebase:debug', 'true');
```

## 10. Next Steps

1. **Backend Functions**: Implement Cloud Functions for webhook handling
2. **Admin Panel**: Create admin interface for product management
3. **Email Notifications**: Add order confirmation emails
4. **Inventory Management**: Implement stock tracking
5. **Analytics**: Add Firebase Analytics for user behavior tracking
