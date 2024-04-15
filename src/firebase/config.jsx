// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwJ7w-NBDEvK074L2O4nKYE4k_Ept-374",
  authDomain: "firestore-6ae5f.firebaseapp.com",
  projectId: "firestore-6ae5f",
  storageBucket: "firestore-6ae5f.appspot.com",
  messagingSenderId: "283142520941",
  appId: "1:283142520941:web:32370916297731c10a7f64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const rt = getDatabase(app)
