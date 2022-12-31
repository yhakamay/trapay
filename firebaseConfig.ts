import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkjud-CozvFv08wH2XKcVEoFqO0C3DyvI",
  authDomain: "trapay-19d0d.firebaseapp.com",
  projectId: "trapay-19d0d",
  storageBucket: "trapay-19d0d.appspot.com",
  messagingSenderId: "454053356539",
  appId: "1:454053356539:web:ff0f9eb240e7ffee2aa15e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
