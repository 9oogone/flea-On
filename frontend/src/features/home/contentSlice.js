// features/contentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTab: 'live',
  contents: {
    live: [
      {
        id: 1,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 1,
        is_live: false,
        live_date: "오늘 오후 8시",
      },
      {
        id: 2,
        name: "웜업탑",
        price: 5000,
        title: "aloyoga 기능성",
        trade_place: "덕명동",
        thumbnail: "https://picsum.photos/160/250",
        live_id: 2,
        is_live: true,
        live_date: "오늘 오후 8시",
      },
    ],
    shorts: [
      {
        id: 2,
        name: "키티템 정리",
        price: 3000,
        trade_place: "덕명동",
        length: "01:30",
        is_scrap: false,
        thumbnail: "https://picsum.photos/160/250",
        shorts_id: 1,
      },
      {
        id: 2,
        name: "키티템 정리",
        price: 3000,
        trade_place: "덕명동",
        length: "01:30",
        is_scrap: false,
        thumbnail: "https://picsum.photos/160/250",
        shorts_id: 2,
      },
    ],
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    switchTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { switchTab } = contentSlice.actions;
export default contentSlice.reducer;
