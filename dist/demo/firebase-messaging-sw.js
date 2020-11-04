importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyB57qn_T8abLL01iKBdoqRTZbRxzZc92hA",
  authDomain: "xopros.firebaseapp.com",
  databaseURL: "https://xopros.firebaseio.com",
  projectId: "xopros",
  storageBucket: "xopros.appspot.com",
  messagingSenderId: "24613401200",
  appId: "1:24613401200:web:f0bd29b936624348433ab5"
});
const messaging = firebase.messaging();