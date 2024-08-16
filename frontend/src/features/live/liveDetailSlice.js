import { createSlice } from "@reduxjs/toolkit";
import { fetchLiveDetail } from "./actions";

const initialState = {
  title: "",
  products: [],
  tradePlace: "",
  liveDate: "",
  liveTradeTimes: [],
  user: {},
  loading: false,
  error: null,
};

const liveDetailSlice = createSlice({
  name: "liveDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.title = action.payload.title;
        state.products = action.payload.products;
        state.tradePlace = action.payload.tradePlace;
        state.liveDate = action.payload.liveDate;
        state.liveTradeTimes = action.payload.liveTradeTimes;
        state.user = action.payload.user;
      })
      .addCase(fetchLiveDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default liveDetailSlice.reducer;
