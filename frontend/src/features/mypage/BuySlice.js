import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "buys",
  buys: [
    {
      id: "1",
      name: "빨래건조대",
      price: "4000",
      place: "중리동",
      date: "2024-08-02",
      time: "13:00:00",
      live_id: 5,
    },
    {
      id: "2",
      name: "아이패드",
      price: "60000",
      place: "중리동",
      date: "2024-08-03",
      time: "13:00:00",
      live_id: 4,
    },
  ],
  waits: [],
};

const BuySlice = createSlice({
  name: "buy",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
    setBuys(state, action) {
      state.buys = action.payload;
    },
    setWaits(state, action) {
      state.waits = action.payload;
    },
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
});

export const { switchTab, setBuys, setWaits, setSelectedTab } =
  BuySlice.actions;
export default BuySlice.reducer;
