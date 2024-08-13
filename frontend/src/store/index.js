import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import contentReducer from "../features/home/contentSlice";
import liveReducer from "../features/live/liveSlice";
import loadingReducer from "../features/live/loadingSlice";
import sessionReducer from "../features/live/sessionSlice";
import CalendarReducer from "../features/mypage/calendarSlice";
import buyReducer from "../features/mypage/buySlice";
import sellReducer from "../features/mypage/sellSlice";
import scrapReducer from "../features/mypage/scrapSlice";
import shortsReducer from "../features/shorts/shortsSlice";
import regionReducer from "../features/region/regionSlice";
import chatReducer from "../features/chat/chatSlice";
import chatroomReducer from "../features/chat/chatroomSlice";
import profileeditReducer from "../features/mypage/profileEditSlice";
import searchReducer from "../features/search/searchSlice";
import "../styles/global.css";
import calendarSlice from "../features/mypage/calendarSlice";
import liveDetailReducer from "../features/live/liveDetailSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    content: contentReducer,
    live: liveReducer,
    loading: loadingReducer,
    session: sessionReducer,
    calendar: calendarSlice,
    buy: buyReducer,
    sell: sellReducer,
    scrap: scrapReducer,
    shorts: shortsReducer,
    region: regionReducer,
    chat: chatReducer,
    chatroom: chatroomReducer,
    profileedit: profileeditReducer,
    search: searchReducer,
    liveDetail: liveDetailReducer,
  },
});

export default store;
