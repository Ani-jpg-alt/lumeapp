# Environment Variables Setup

To secure your Firebase configuration, create a `.env.local` file in your project root with the following variables:

## Create .env.local file

Create a file named `.env.local` in your project root directory (same level as package.json) with the following content:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDq2jV81d3gLuBpSbVxTNGmReGlkgTIrGQ
REACT_APP_FIREBASE_AUTH_DOMAIN=lumeapp-95b00.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=lumeapp-95b00
REACT_APP_FIREBASE_STORAGE_BUCKET=lumeapp-95b00.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=761334092567
REACT_APP_FIREBASE_APP_ID=1:761334092567:web:2d7e98fb961adbb1681d52
REACT_APP_FIREBASE_MEASUREMENT_ID=G-20XLR718Q5
```

## Important Notes

1. **Never commit .env.local to version control** - This file should be in your `.gitignore`
2. **Restart your development server** after creating the .env.local file
3. **Environment variables must start with REACT_APP_** to be accessible in React
4. **The current config.js has fallback values** so the app will work even without the .env.local file

## Security Benefits

- Keeps sensitive API keys out of your source code
- Allows different configurations for development, staging, and production
- Prevents accidental exposure of credentials in version control

## Production Deployment

For production deployment, set these environment variables in your hosting platform:
- Vercel: Add them in Project Settings → Environment Variables
- Netlify: Add them in Site Settings → Environment Variables
- Firebase Hosting: Use Firebase Functions or set them in your build process
