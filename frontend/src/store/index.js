// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import levelReducer from "../features/mypage/levelSlice";
import contentReducer from "../features/home/contentSlice";
import loadingReducer from "../features/live/loadingSlice";
import sessionReducer from "../features/live/sessionSlice";
import "../styles/global.css";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    level: levelReducer,
    content: contentReducer,
    loading: loadingReducer,
    session: sessionReducer,
  },
});

export default store;
