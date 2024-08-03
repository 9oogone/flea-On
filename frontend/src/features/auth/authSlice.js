// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper functions to handle localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("authState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = loadState() || {
  isAuthenticated: false,
  user: { phone: null, nickname: null, user_region: null },
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      saveState(state);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      saveState(state);
    },
    setUser(state, action) {
      state.user = action.payload.user || null;
      saveState(state);
    },
    setPhone(state, action) {
      state.user.phone = action.payload;
      saveState(state);
    },
    setNickname(state, action) {
      state.user.nickname = action.payload;
      saveState(state);
    },
    setUserRegion(state, action) {
      state.user.user_region = action.payload;
      saveState(state);
    },
  },
});

export const { login, logout, setUser, setPhone, setNickname, setUserRegion } =
  authSlice.actions;
export default authSlice.reducer;
