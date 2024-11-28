// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtvKs5Wrs3S1x8Rz7Ha9iei6tc1Kxud2E",
  authDomain: "veterinary-clinic-40ae2.firebaseapp.com",
  projectId: "veterinary-clinic-40ae2",
  storageBucket: "veterinary-clinic-40ae2.appspot.com",
  messagingSenderId: "206030025346",
  appId: "1:206030025346:web:f7b0ea5bd58f18fe28fa9b",
  measurementId: "G-SLB919P9Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;