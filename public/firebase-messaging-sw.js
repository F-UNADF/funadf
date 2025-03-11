// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCxbYAg-_eIci32Qf1ZRoKZLwkOD-vTuHo",
    authDomain: "funadf-49dfb.firebaseapp.com",
    projectId: "funadf-49dfb",
    storageBucket: "funadf-49dfb.firebasestorage.app",
    messagingSenderId: "609947767440",
    appId: "1:609947767440:web:17de62d5e49d3a0c2ffe15",
    measurementId: "G-394J13VTZX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite/assets/logo-BJLKEjos.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});