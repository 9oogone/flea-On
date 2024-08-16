// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDUuih6kZ_OyQjpJtrdz9ETNburSRVLIHQ",
  authDomain: "fleaon-d171c.firebaseapp.com",
  projectId: "fleaon-d171c",
  storageBucket: "fleaon-d171c.appspot.com",
  messagingSenderId: "18480875171",
  appId: "1:18480875171:web:4e89609b98d4e20809a116",
  measurementId: "G-K79ZF5WQY1",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || "./icons/icon-144x144.png",
    data: {
      url: payload.data.redirect_url || "/",
    },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.url;
  event.notification.close(); // 알림 닫기
  event.waitUntil(clients.openWindow(url)); // URL 열기
});
