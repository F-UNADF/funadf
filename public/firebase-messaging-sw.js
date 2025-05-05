importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCxbYAg-_eIci32Qf1ZRoKZLwkOD-vTuHo",
    authDomain: "funadf-49dfb.firebaseapp.com",
    projectId: "funadf-49dfb",
    storageBucket: "funadf-49dfb.firebasestorage.app",
    messagingSenderId: "609947767440",
    appId: "1:609947767440:web:17de62d5e49d3a0c2ffe15",
    measurementId: "G-394J13VTZX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Message reçu en arrière-plan :", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.image,
    });
});