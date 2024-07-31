// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,

  },
});

export default store;
