 import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE_higu6acP7qlQbGQfglYnYSY6qr6-xg",
  authDomain: "barbearia-app-3e6a8.firebaseapp.com",
  projectId: "barbearia-app-3e6a8",
  storageBucket: "barbearia-app-3e6a8.firebasestorage.app",
  messagingSenderId: "342597064819",
  appId: "1:342597064819:web:0363e5aee19bf77cd3b206",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;