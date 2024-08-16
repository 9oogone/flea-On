// src/features/mypage/watchListSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchLiveScrap, fetchShortsScrap } from "./actions";

const initialState = {
  selectedTab: "live",
  liveScrap: {
    loading: false,
    data: [],
    error: null,
  },
  shortsScrap: {
    loading: false,
    data: [],
    error: null,
  },
};

const scrapSlice = createSlice({
  name: "scrap",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
    toggleScrap(state, action) {
      const { id, type } = action.payload; // type은 'live' 또는 'shorts'

      if (type === "live") {
        state.liveScrap.data = state.liveScrap.data.map((item) =>
          item.id === id ? { ...item, is_scrap: !item.is_scrap } : item
        );
      } else if (type === "shorts") {
        state.shortsScrap.data = state.shortsScrap.data.map((item) =>
          item.id === id ? { ...item, is_scrap: !item.is_scrap } : item
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveScrap.pending, (state) => {
        state.liveScrap.loading = true;
      })
      .addCase(fetchLiveScrap.fulfilled, (state, action) => {
        state.liveScrap.loading = false;
        state.liveScrap.data = action.payload;
      })
      .addCase(fetchLiveScrap.rejected, (state, action) => {
        state.liveScrap.loading = false;
        state.liveScrap.error = action.error.message;
      })
      .addCase(fetchShortsScrap.pending, (state) => {
        state.shortsScrap.loading = true;
      })
      .addCase(fetchShortsScrap.fulfilled, (state, action) => {
        state.shortsScrap.loading = false;
        state.shortsScrap.data = action.payload;
      })
      .addCase(fetchShortsScrap.rejected, (state, action) => {
        state.shortsScrap.loading = false;
        state.shortsScrap.error = action.error.message;
      });
  },
});

export const { switchTab, toggleScrap } = scrapSlice.actions;

export default scrapSlice.reducer;
