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
  apiKey: "AIzaSyDfHuZVpz-t9DLwjwpQrM0QWM_usMnI04c",
  authDomain: "midtrade-b872b.firebaseapp.com",
  databaseURL: "https://midtrade-b872b-default-rtdb.firebaseio.com",
  projectId: "midtrade-b872b",
  storageBucket: "midtrade-b872b.appspot.com",
  messagingSenderId: "882835595317",
  appId: "1:882835595317:web:2d39af2c80a6fdba73517c",
  measurementId: "G-HWB9VKGQ4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
