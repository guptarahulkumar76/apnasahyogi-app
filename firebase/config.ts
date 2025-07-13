import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR-KEY',
  authDomain: 'YOUR-AUTH',
  projectId: 'apnasahyogi',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
