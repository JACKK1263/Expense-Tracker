import { initializeApp } from "firebase/app";
/* import { getAnalytics } from "firebase/analytics"; */
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDTb4QCcXB3o52Bdudg8YOLZqIjIyk4Np4",
  authDomain: "expense-tracker-3facf.firebaseapp.com",
  projectId: "expense-tracker-3facf",
  storageBucket: "expense-tracker-3facf.firebasestorage.app",
  messagingSenderId: "592611622305",
  appId: "1:592611622305:web:2afc5a0075c68939245fe0",
  measurementId: "G-46ZTTL1X44"
};

const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app); */
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };