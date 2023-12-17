import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD7KdT95B3MThJ0A-ZyKOskkFixTPHsHIA',
  authDomain: 'journalisto-aae0f.firebaseapp.com',
  projectId: 'journalisto-aae0f',
  storageBucket: 'journalisto-aae0f.appspot.com',
  messagingSenderId: '255587758716',
  appId: '1:255587758716:web:f98ed7b7bfece484820ff9'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
