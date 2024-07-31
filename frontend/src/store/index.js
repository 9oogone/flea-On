// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import levelReducer from "../features/mypage/levelSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    level: levelReducer,
  },
});

export default store;
