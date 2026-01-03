import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBD9oEFNPS-7xR6gb77-oNwDnQiv84En3U",
    authDomain: "justa-a4ed5.firebaseapp.com",
    projectId: "justa-a4ed5",
    storageBucket: "justa-a4ed5.firebasestorage.app",
    messagingSenderId: "1056505807402",
    appId: "1:1056505807402:web:2f52ed9f85594faf08b953",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);