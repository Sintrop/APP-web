import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAjpN058iWNSC_UYLepYoBRMeRBTOglyg",
  authDomain: "sintrop-app-android.firebaseapp.com",
  projectId: "sintrop-app-android",
  storageBucket: "sintrop-app-android.appspot.com",
  messagingSenderId: "851824435865",
  appId: "1:851824435865:web:80bd64956003d416268e08",
  measurementId: "G-KTXK67N4BV"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export {storage, firestore};