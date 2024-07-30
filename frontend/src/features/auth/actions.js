// src/features/auth/actions.js
import { login, logout, setLoading } from "./authSlice";
import Cookies from "js-cookie";

// export const handleSocialLogin = (data) => (dispatch) => {
//   const { token, user } = data;
//   dispatch(login({ token, user }));
//   Cookies.set("Authorization", token, { expires: 1 });
// };

export const performLogout = () => (dispatch) => {
  Cookies.remove("Authorization");
  dispatch(logout());
};

export const checkLoginStatus = () => (dispatch) => {
  dispatch(setLoading(true)); // 로딩 시작
  const token = Cookies.get("Authorization");
  if (token) {
    dispatch(login({ token, user: null }));
  } else {
    dispatch(logout());
  }
  dispatch(setLoading(false)); // 로딩 완료
};
