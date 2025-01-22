import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDI0SAlMvlNfSop56ClEEfBvNOcZTzLGHE",
  authDomain: "heating-pad.firebaseapp.com",
  projectId: "heating-pad",
  storageBucket: "heating-pad.firebasestorage.app",
  messagingSenderId: "883615324170",
  appId: "1:883615324170:web:251989d0ad6a6aa541a7f3",
  measurementId: "G-95T63M6XWE"
};

const app = initializeApp(firebaseConfig);


 const firestore = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db , firestore};