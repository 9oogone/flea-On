import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import contentReducer from "../features/home/contentSlice";
import loadingReducer from "../features/live/loadingSlice";
import sessionReducer from "../features/live/sessionSlice";
import scrapReducer from "../features/mypage/scrapSlice";
import buylistReducer from "../features/mypage/buylistSlice";
import selllistReducer from "../features/mypage/selllistSlice";
import watchlistReducer from "../features/mypage/watchlistSlice";
import shortsReducer from "../features/shorts/shortsSlice";
import regionReducer from "../features/region/regionSlice";
import chatReducer from "../features/chat/chatSlice"
import chatroomReducer from "../features/chat/chatroomSlice"
import profileeditReducer from "../features/mypage/profileEditSlice";
import "../styles/global.css";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    content: contentReducer,
    loading: loadingReducer,
    session: sessionReducer,
    scrap: scrapReducer,
    buy: buylistReducer,
    sell: selllistReducer,
    watch: watchlistReducer,
    shorts: shortsReducer,

    region: regionReducer,

    chat: chatReducer,
    chatroom: chatroomReducer,
    profileedit: profileeditReducer,
  },
});

export default store;
