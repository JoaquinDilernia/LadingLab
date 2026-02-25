import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfs5Jxhk0TgsIhSeKpgJ-w6xMkUSGE4Zc",
  authDomain: "pedidos-lett-2.firebaseapp.com",
  projectId: "pedidos-lett-2",
  storageBucket: "pedidos-lett-2.appspot.com",
  messagingSenderId: "459720672669",
  appId: "1:459720672669:web:71b5979cce50dcb1219b74",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
