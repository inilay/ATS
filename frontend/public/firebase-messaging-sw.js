// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {

  apiKey: "AIzaSyDufx6kJOGIryLwjqpDwHWqO7s_wdg6ry8",
  authDomain: "tournaments-5bd34.firebaseapp.com",
  projectId: "tournaments-5bd34",
  storageBucket: "tournaments-5bd34.firebasestorage.app",
  messagingSenderId: "143253714306",
  appId: "1:143253714306:web:bc8d97151ebbc42a9acb9b",
  measurementId: "G-S9DGG6Z38K"

};



firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  // icon: payload.notification.image,
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',

  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});