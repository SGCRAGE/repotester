// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeqodJXU1JpvvZekfTa7hYlHVEiiiFF9w",
  authDomain: "idk-test-70704.firebaseapp.com",
  projectId: "idk-test-70704",
  storageBucket: "idk-test-70704.appspot.com",
  messagingSenderId: "575047362576",
  appId: "1:575047362576:web:9362dd8f4a9581659ac295",
  measurementId: "G-8YHEHG5C5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Add sign-in functionality
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          // Handle result
          console.log('User signed in:', result.user);
        })
        .catch((error) => {
          console.error('Error during sign-in:', error);
        });
    });
  } else {
    console.error('Login button not found');
  }
});
