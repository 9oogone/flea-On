// src/features/auth/actions.js
import { login, logout, setUser } from "./authSlice";
import Cookies from "js-cookie";
import baseAxios from "../../utils/httpCommons"; // Adjust the path according to your project structure

export const performLogout = () => (dispatch) => {
  Cookies.remove("Authorization");
  dispatch(logout());
};

export const fetchUserInfo = () => async (dispatch, getState) => {
  const token = process.env.REACT_APP_TOKEN
    ? process.env.REACT_APP_TOKEN
    : getState().auth.token;

  if (!token) {
    console.error("No token found, cannot fetch user info");
    return;
  }

  try {
    const response = await baseAxios().get("/fleaon/users/info");

    if (response.status !== 200) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = response.data;

    // 로컬 스토리지에서 FCM 토큰 가져오기
    const fcmToken = localStorage.getItem("fcmToken");

    // FCM 토큰을 user 정보에 추가
    if (fcmToken) {
      userInfo.fcm = fcmToken;
      await baseAxios().post(`/fleaon/users/fcm?fcmToken=${fcmToken}`);
      console.log("FCM Token sent successfully.");
    } else {
      console.log("No FCM Token found in local storage.");
    }
    dispatch(setUser({ user: userInfo }));
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    // Optionally handle logout or error state
  }
};

export const performLogin = (payload) => async (dispatch) => {
  const token = payload.token;
  dispatch(login({ token }));

  // Set the token in cookies
  Cookies.set("Authorization", token);

  // Fetch user info after login
  dispatch(fetchUserInfo());
};
