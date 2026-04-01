import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBF91Ymtjhrqu_2IMMmDEKqLwpncND1KNw",
  authDomain: "upload-images-v2.firebaseapp.com",
  projectId: "upload-images-v2",
  storageBucket: "upload-images-v2.firebasestorage.app",
  messagingSenderId: "844669967389",
  appId: "1:844669967389:web:a4999758ce801e1d7d7af4",
  measurementId: "G-969MM0RWS3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);