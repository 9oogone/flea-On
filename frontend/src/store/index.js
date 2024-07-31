// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice"
import levelReducer from "../features/mypage/levelSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    level: levelReducer,
  },
});

export default store;
