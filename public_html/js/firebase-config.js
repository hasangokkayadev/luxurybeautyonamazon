// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMJakLU9NUtlLSpSlRdpFDyuRc4duEDAw",
  authDomain: "luxurybeautyon.firebaseapp.com",
  projectId: "luxurybeautyon",
  storageBucket: "luxurybeautyon.firebasestorage.app",
  messagingSenderId: "820750435400",
  appId: "1:820750435400:web:96fa63482b3f907c96047d",
  measurementId: "G-VWE02D9TFM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
