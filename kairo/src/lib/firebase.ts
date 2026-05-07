import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIGuNpUOqdwaM7Oz6AKcbICyVC90fwNNo",
  authDomain: "placement-cell12.firebaseapp.com",
  projectId: "placement-cell12",
  storageBucket: "placement-cell12.firebasestorage.app",
  messagingSenderId: "998740039411",
  appId: "1:998740039411:web:72b267aeeec4ddd2a8c986",
  measurementId: "G-NQ550M6MLS",
};

// Avoid re-initializing on hot reloads in Next.js dev mode
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
