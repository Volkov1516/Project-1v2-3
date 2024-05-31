import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQuCXvFFXPl6lTFEGvv8yuULlXX-MiHK4",
  authDomain: "project-1-e93b8.firebaseapp.com",
  projectId: "project-1-e93b8",
  storageBucket: "project-1-e93b8.appspot.com",
  messagingSenderId: "278998425236",
  appId: "1:278998425236:web:55ed2508b7669722871e81"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
