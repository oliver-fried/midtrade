// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { auth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1yN51equqqnac73upYa5Cm5PlOsTajOw",
  authDomain: "midtrade-fcbd0.firebaseapp.com",
  databaseURL: "https://midtrade-fcbd0-default-rtdb.firebaseio.com",
  projectId: "midtrade-fcbd0",
  storageBucket: "midtrade-fcbd0.appspot.com",
  messagingSenderId: "195967808101",
  appId: "1:195967808101:web:ec0ef691345d542c084c8c",
  measurementId: "G-D51J1BB270"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
