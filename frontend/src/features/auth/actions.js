// src/features/auth/actions.js
import { logout, setToken } from "./authSlice";
import Cookies from "js-cookie";

export const performLogout = () => (dispatch) => {
  Cookies.remove("Authorization");
  dispatch(logout());
};

// setToken 액션은 authSlice에서 바로 사용
