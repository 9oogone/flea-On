// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import baseAxios from "./utils/httpCommons";

const firebaseConfig = {
  apiKey: "AIzaSyDUuih6kZ_OyQjpJtrdz9ETNburSRVLIHQ",
  authDomain: "fleaon-d171c.firebaseapp.com",
  projectId: "fleaon-d171c",
  storageBucket: "fleaon-d171c.appspot.com",
  messagingSenderId: "18480875171",
  appId: "1:18480875171:web:4e89609b98d4e20809a116",
  measurementId: "G-K79ZF5WQY1",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_TOKEN })
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            //이때 로컬 스토리지에 FCM 토큰 저장
            localStorage.setItem("fcmToken", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      //   resolve(payload);
    });
  });
}
