// src/features/auth/actions.js
import { login, logout } from "./authSlice";
import Cookies from "js-cookie";

export const handleSocialLogin = (data) => (dispatch) => {
  const { token, user } = data;
  dispatch(login(user));
  Cookies.set("Authorization", token, { expires: 1 });
};

export const performLogout = () => (dispatch) => {
  Cookies.remove("Authorization");
  dispatch(logout());
};

export const checkLoginStatus = () => (dispatch) => {
  const token = Cookies.get("Authorization");
  if (token) {
    dispatch(login({ token })); // 여기서 토큰만 확인하고 로그인 상태로 만듭니다.
  } else {
    dispatch(logout());
  }
};
