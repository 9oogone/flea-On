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
<<<<<<< HEAD
  ? process.env.REACT_APP_TOKEN:getState().auth.token;
=======
    ? process.env.REACT_APP_TOKEN
    : getState().auth.token;
>>>>>>> b1fcdcdbf75b61dd03a812f5b7f24f8dca87768b

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
