// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-recipe-app-ce8c5.firebaseapp.com",
  projectId: "mern-recipe-app-ce8c5",
  storageBucket: "mern-recipe-app-ce8c5.firebasestorage.app",
  messagingSenderId: "819642081667",
  appId: "1:819642081667:web:5d201b9d0036204ce7d6b6",
  measurementId: "G-C32YTY369L",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
