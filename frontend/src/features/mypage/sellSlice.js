import { createSlice } from "@reduxjs/toolkit";
import { fetchSellLive, fetchSellShorts } from "./actions";

const initialState = {
  selectedTab: "live",
  live: {
    loading: false,
    data: [],
    error: null,
  },
  shorts: {
    loading: false,
    data: [],
    error: null,
  },
};

const sellSlice = createSlice({
  name: "sell",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellLive.pending, (state) => {
        state.live.loading = true;
      })
      .addCase(fetchSellLive.fulfilled, (state, action) => {
        state.live.loading = false;
        state.live.data = action.payload;
      })
      .addCase(fetchSellLive.rejected, (state, action) => {
        state.live.loading = false;
        state.live.error = action.error.message;
      })
      .addCase(fetchSellShorts.pending, (state) => {
        state.shorts.loading = true;
      })
      .addCase(fetchSellShorts.fulfilled, (state, action) => {
        state.shorts.loading = false;
        state.shorts.data = action.payload;
      })
      .addCase(fetchSellShorts.rejected, (state, action) => {
        state.shorts.loading = false;
        state.shorts.error = action.error.message;
      });
  },
});

export const { switchTab } = sellSlice.actions;
export default sellSlice.reducer;
