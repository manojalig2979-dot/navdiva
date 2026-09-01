// Navdiva Group - Firebase SDK Initialization & Config (v10 / Modular)
// Project: navdiva-de905

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCJEjqBZBD_4-6JBjZNW_TQiBlb7mr7gw",
  authDomain: "navdiva-de905.firebaseapp.com",
  projectId: "navdiva-de905",
  storageBucket: "navdiva-de905.firebasestorage.app",
  messagingSenderId: "373242537609",
  appId: "1:373242537609:web:414e6a6c81d2b3f235c858",
  measurementId: "G-76ENN4QPEC"
};

// Initialize Firebase safely
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics, firebaseConfig };
