import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "lives",
  contents: {
    lives: [
      {
        id: 1, //live_id
        title: "이사 준비 대정리!",
        place: "노은동",
        date: "2022-06-30",
      },
      {
        id: 2,
        title: "자취 초보 분들 오세요 결혼 전에 자취방 정리 중",
        place: "송촌동",
        date: "2023-06-30",
      },
      {
        id: 3,
        title: "강아지 물품 정리합니다.",
        place: "덕명동",
        date: "2024-06-30",
      },
      {
        id: 4,
        title: "창고 대방출",
        place: "덕명동",
        date: "2024-06-30",
      },
    ],
    shorts: [
      {
        id: "1",
        name: "빨래건조대",
        price: "4000",
        place: "중리동",
        date: "2024-08-07",
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
      },
    ],
  },
};

const selllistSlice = createSlice({
  name: "sell",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
    setLives(state, action) {
      state.contents.lives = action.payload;
    },
    setShorts(state, action) {
      state.contents.shorts = action.payload;
    },
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
});

export const { switchTab, setLives, setShorts, setSelectedTab } =
  selllistSlice.actions;
export default selllistSlice.reducer;
