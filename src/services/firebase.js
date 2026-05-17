// ============================================================
// Firebase Configuration
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add Project" and follow the steps
// 3. In your project, go to Project Settings > General
// 4. Scroll to "Your apps" and click the </> (Web) icon
// 5. Register your app and copy the firebaseConfig object below
// 6. Create a .env.local file (copy from .env.example) and fill in your values
// 7. In Firebase console, enable:
//    - Authentication > Sign-in method > Email/Password
//    - Firestore Database > Create database (start in test mode)
// ============================================================

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
};

// Avoid duplicate app initialization (useful in HMR / dev)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
export default app;
