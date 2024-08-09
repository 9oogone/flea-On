import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentShort: null,
  shorts: [
    {
      id: 13,
      name: "키티템 정리",
      price: 3000,
      trade_place: "덕명동",
      length: "01:30",
      is_scrap: false,
      thumbnail: "https://picsum.photos/160/250",
      shorts_id: 1,
    },
    {
      id: 14,
      name: "키티템 정리",
      price: 3000,
      trade_place: "덕명동",
      length: "01:30",
      is_scrap: false,
      thumbnail: "https://picsum.photos/160/250",
      shorts_id: 1,
    },
    {
      id: 3,
      name: "키티템 정리",
      price: 3000,
      trade_place: "덕명동",
      length: "01:30",
      is_scrap: true,
      thumbnail: "https://picsum.photos/160/250",
      shorts_id: 2,
    },
    {
      id: 4,
      name: "키티템 정리",
      price: 3000,
      trade_place: "덕명동",
      length: "01:30",
      is_scrap: true,
      thumbnail: "https://picsum.photos/160/250",
      shorts_id: 2,
    },
  ],
};

const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {
    setCurrentShort: (state, action) => {
      state.currentShort = action.payload;
    },
    setShorts: (state, action) => {
      state.shorts = action.payload;
    },
    toggleScrap: (state, action) => {
      const { shortsId } = action.payload;
      state.shorts = state.shorts.map((short) =>
        short.id === shortsId ? { ...short, is_scrap: !short.is_scrap } : short
      );
    },
  },
});

export const { setCurrentShort, setShorts, toggleScrap } = shortsSlice.actions;
export default shortsSlice.reducer;
