import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_hei1oxilN5rhwgbYs11sy_4LNGB_NTk",
  authDomain: "omniumicon.firebaseapp.com",
  projectId: "omniumicon",
  storageBucket: "omniumicon.appspot.com",
  messagingSenderId: "725228151476",
  appId: "1:725228151476:web:cddcc09d002fe46a4e2de1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
