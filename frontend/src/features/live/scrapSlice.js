import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  live: [
    {
      id: 2,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: true,
      live_date: "오늘 오후 8시",
    },
    {
      id: 3,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 2,
      is_scrap: true,
      is_live: true,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 4,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 3,
      is_scrap: true,
      is_live: true,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 1,
      name: "웜업탑",
      price: 5000,
      title: "식료품 타이쿤 대방출",
      trade_place:
        "대전광역시 동구 덕명동 삼성화재연수원 유성동캠퍼스 동원가든 경비실 앞 자전거 거치대",
      thumbnail: "https://picsum.photos/160/250",
      author: "초호기딸기왕",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [
        { name: "라면", price: 3000 },
        { name: "젤리", price: 3000 },
        { name: "푸딩", price: 3000 },
      ],
    },
    {
      id: 5,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 6,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 7,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 8,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
    {
      id: 9,
      name: "웜업탑",
      price: 5000,
      title: "aloyoga 기능성",
      trade_place: "덕명동",
      thumbnail: "https://picsum.photos/160/250",
      live_id: 1,
      is_scrap: true,
      is_live: false,
      live_date: "오늘 오후 8시",
      products: [{ name: "라면", price: 3000 }],
    },
  ],
};

const scrapSlice = createSlice({
  name: "scrap",
  initialState,
  reducers: {
    toggleScrap(state, action) {
      const { id } = action.payload;
      state.live = state.live.map((item) =>
        item.id === id ? { ...item, is_scrap: !item.is_scrap } : item
      );
    },
  },
});

export const { toggleScrap } = scrapSlice.actions;
export default scrapSlice.reducer;
