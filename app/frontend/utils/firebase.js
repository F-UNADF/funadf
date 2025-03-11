// firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCxbYAg-_eIci32Qf1ZRoKZLwkOD-vTuHo",
    authDomain: "funadf-49dfb.firebaseapp.com",
    projectId: "funadf-49dfb",
    storageBucket: "funadf-49dfb.firebasestorage.app",
    messagingSenderId: "609947767440",
    appId: "1:609947767440:web:17de62d5e49d3a0c2ffe15",
    measurementId: "G-394J13VTZX"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Cloud Messaging
const messaging = getMessaging(app);

export { messaging };
