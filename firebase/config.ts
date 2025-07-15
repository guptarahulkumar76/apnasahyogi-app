import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCKlERdTH1YKYaqhArJWYE_S_FYeFkfyl4",
  authDomain: "apnasahyogi-40c6d.firebaseapp.com",
  projectId: "apnasahyogi-40c6d",
  storageBucket: "apnasahyogi-40c6d.firebasestorage.app",
  messagingSenderId: "338029899040",
  appId: "1:338029899040:web:51d0c843860de15bee3b45",
  measurementId: "G-NR2BEP0LS1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
