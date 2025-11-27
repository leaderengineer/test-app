// Firebase initialization and Firestore export
// Fill your .env with VITE_ prefixed keys before running the app

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// ⚠️ MUHIM:
// Quyidagi ENV o'zgaruvchilarni loyihaning ildizida (.env faylida) to'ldirishingiz kerak:
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_PROJECT_ID=...
// VITE_FIREBASE_STORAGE_BUCKET=...
// VITE_FIREBASE_MESSAGING_SENDER_ID=...
// VITE_FIREBASE_APP_ID=...
//
// Bu qiymatlarni Firebase Console → Project settings → General → Your apps (Web)
// bo'limidan olasiz (config ichidagi qiymatlar).

const firebaseConfig = {
  apiKey: "AIzaSyBqYei-ZM_OlV9orOof9ibiZZw2_In7ZsI",
  authDomain: "test-app-83263.firebaseapp.com",
  projectId: "test-app-83263",
  storageBucket: "test-app-83263.firebasestorage.app",
  messagingSenderId: "888484942411",
  appId: "1:888484942411:web:8066e1f187494b462af3ce"
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  // eslint-disable-next-line no-console
  console.error(
    "Firebase config xato yoki to'liq emas. Iltimos, .env fayldagi VITE_FIREBASE_* qiymatlarni tekshiring."
  );

  // Diagnostika uchun qisqa log (API key to'liq chiqmaydi)
  // eslint-disable-next-line no-console
  console.log("Firebase config tekshiruv:", {
    apiKey: firebaseConfig.apiKey
      ? `${firebaseConfig.apiKey.slice(0, 6)}...`
      : undefined,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
  });
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
