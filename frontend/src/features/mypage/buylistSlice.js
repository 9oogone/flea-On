import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "buys",
  contents: {
    buys: [
      {
        id: "1",
        name: "빨래건조대",
        price: "4000",
        place: "중리동",
        date: "2024-08-07",
        time: "13:00:00",
        live_id: 5,
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
        time: "13:00:00",
        live_id: 4,
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
        time: "13:00:00",
        live_id: 4,
      },
    ],
    waits: [
      {
        id: "1",
        name: "빨래건조대",
        price: "4000",
        place: "중리동",
        date: "2024-08-07",
        live_id: 5,
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
        live_id: 4,
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
        live_id: 4,
      },
    ],
  },
};

const buylistSlice = createSlice({
  name: "buy",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
    setBuys(state, action) {
      state.contents.buys = action.payload;
    },
    setWaits(state, action) {
      state.contents.waits = action.payload;
    },
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
});

export const { switchTab, setBuys, setWaits, setSelectedTab } =
  buylistSlice.actions;
export default buylistSlice.reducer;
