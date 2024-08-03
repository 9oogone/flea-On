// src/features/auth/actions.js
import { login, logout, setUser } from "./authSlice";
import Cookies from "js-cookie";

export const performLogout = () => (dispatch) => {
  Cookies.remove("Authorization");
  dispatch(logout());
};

export const fetchUserInfo = () => async (dispatch, getState) => {
  const { token } = getState().auth;

  if (!token) {
    console.error("No token found, cannot fetch user info");
    return;
  }

  try {
    const response = await fetch(
      "http://i11b202.p.ssafy.io/fleaon/users/info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
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
