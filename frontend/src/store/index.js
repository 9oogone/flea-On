import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import levelReducer from "../features/mypage/levelSlice";
import contentReducer from "../features/home/contentSlice";
import loadingReducer from "../features/live/loadingSlice";
import sessionReducer from "../features/live/sessionSlice";
import buylistReducer from "../features/mypage/buylistSlice";
import selllistReducer from "../features/mypage/selllistSlice";
import watchlistReducer from "../features/mypage/watchlistSlice";
import shortsReducer from "../features/shorts/shortsSlice";
import regionReducer from "../features/region/regionSlice";
import "../styles/global.css";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    level: levelReducer,
    content: contentReducer,
    loading: loadingReducer,
    session: sessionReducer,
    buy: buylistReducer,
    sell: selllistReducer,
    watch: watchlistReducer,
    shorts: shortsReducer,
    region: regionReducer,
  },
});

export default store;
