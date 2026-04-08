import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCpa9qT7RNUO-HhCPj9yI6syAaE8FnoTYA",
    authDomain: "app-technext96.firebaseapp.com",
    projectId: "app-technext96",
    storageBucket: "app-technext96.firebasestorage.app",
    messagingSenderId: "502156100653",
    appId: "1:502156100653:web:aeca8074a57c01c29b24a4"
};

// Initialize Firebase
// Check if an app instance already exists to avoid re-initialization in Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics conditionally (Client side only)
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, analytics };
