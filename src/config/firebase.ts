// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDUc2kbMR_XK6OKitWHaHwuwCtnRWGYgw",
  authDomain: "tournaments-ee5af.firebaseapp.com",
  projectId: "tournaments-ee5af",
  storageBucket: "tournaments-ee5af.firebasestorage.app",
  messagingSenderId: "768990935465",
  appId: "1:768990935465:web:fcb3d316a99009c9636cb8",
  measurementId: "G-3GTZK84KSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app; 