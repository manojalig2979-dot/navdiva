import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js';

const firebaseConfig={apiKey:'AIzaSyDCJEjqBZBD_4-6JBjZNW_TQiBlb7mr7gw',authDomain:'navdiva-de905.firebaseapp.com',projectId:'navdiva-de905',storageBucket:'navdiva-de905.firebasestorage.app',messagingSenderId:'373242537609',appId:'1:373242537609:web:414e6a6c81d2b3f235c858',measurementId:'G-76ENN4QPEC'};
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
export const auth=getAuth(app); export const db=getFirestore(app); export const storage=getStorage(app); export {app};
