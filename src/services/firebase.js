import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "sintrop-app-android.firebaseapp.com",
  projectId: "sintrop-app-android",
  storageBucket: "sintrop-app-android.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-KTXK67N4BV"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export {storage, firestore};