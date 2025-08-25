// Firebase initialization and Firestore export
// Fill your .env with VITE_ prefixed keys before running the app

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJIZbKGheAxHNHeZyT725MfMZ9bJlB8K4",
  authDomain: "test-app-7c779.firebaseapp.com",
  projectId: "test-app-7c779",
  storageBucket: "test-app-7c779.firebasestorage.app",
  messagingSenderId: "942638516984",
  appId: "1:942638516984:web:5afb5c00afb9d95249090d",
};

// Guard for missing config to avoid runtime crashes
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Firebase config is missing. Please set VITE_FIREBASE_* variables in your .env file."
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
