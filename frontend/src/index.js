import React from "react";
import ReactDOM from "react-dom/client";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import "./styles/global.css";

import { requestPermission, onMessageListener } from "./firebase"; // Firebase 초기화 파일 임포트

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);

// Firebase 푸시 알림 권한 요청
requestPermission();

// 메시지 리스너 설정
onMessageListener()
  .then((payload) => {
    console.log("Received foreground message: ", payload);
  })
  .catch((err) => console.log("Error in receiving message: ", err));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// Register the service worker
serviceWorker.register({
  onUpdate: (registration) => {
    console.log("Service worker onUpdate:", registration);
  },
  onSuccess: (registration) => {
    console.log("Service worker onSuccess:", registration);
  },
});
