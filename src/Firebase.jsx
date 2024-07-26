
// Firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEvPPlFu1nKLTxHbuNQvNuxV45i3pmhXs",
  authDomain: "payment-ee7c2.firebaseapp.com",
  projectId: "payment-ee7c2",
  storageBucket: "payment-ee7c2.appspot.com",
  messagingSenderId: "93255696332",
  appId: "1:93255696332:web:59c5a051698860f9946769",
  measurementId: "G-J8F3FYYNEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const fireDB = getFirestore(app);

export { app, fireDB };

