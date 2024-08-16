import { createSlice } from "@reduxjs/toolkit";
import { fetchBuys, fetchWaits } from "./actions";

const initialState = {
  selectedTab: "buys",
  buys: {
    loading: false,
    data: {},
    error: null,
  },
  waits: {
    loading: false,
    data: [],
    error: null,
  },
};

const buySlice = createSlice({
  name: "buy",
  initialState,
  reducers: {
    switchTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuys.pending, (state) => {
        state.buys.loading = true;
      })
      .addCase(fetchBuys.fulfilled, (state, action) => {
        state.buys.loading = false;
        state.buys.data = action.payload;
      })
      .addCase(fetchBuys.rejected, (state, action) => {
        state.buys.loading = false;
        state.buys.error = action.error.message;
      })
      .addCase(fetchWaits.pending, (state) => {
        state.waits.loading = true;
      })
      .addCase(fetchWaits.fulfilled, (state, action) => {
        state.waits.loading = false;
        state.waits.data = action.payload;
      })
      .addCase(fetchWaits.rejected, (state, action) => {
        state.waits.loading = false;
        state.waits.error = action.error.message;
      });
  },
});

export const { switchTab } = buySlice.actions;
export default buySlice.reducer;
