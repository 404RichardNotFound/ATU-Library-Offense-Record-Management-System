import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: 'atu-lorms-4ef2f',
  storageBucket: 'atu-lorms-4ef2f.firebasestorage.app',
  messagingSenderId: '605788512948',
  appId: '1:605788512948:web:179b784908de6da84f6de1',
  measurementId: 'G-YXNKP50ZHE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
