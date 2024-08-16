// src/features/mypage/calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchCalendarWeek, fetchCalendarDate, confirmTrade } from "./actions";

const initialState = {
  week: {
    loading: false,
    tradeInfo: {
      totalTrade: 0,
      saleCount: 0,
      purchaseCount: 0,
      completedTrades: 0,
    },
    tradeList: [],
    error: null,
  },
  date: {
    loading: false,
    data: {},
    error: null,
  },
  confirm: {
    loading: false,
    success: false,
    error: null,
  },
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarWeek.pending, (state) => {
        state.week.loading = true;
      })
      .addCase(fetchCalendarWeek.fulfilled, (state, action) => {
        state.week.loading = false;
        state.week.tradeInfo = action.payload.tradeInfo;
        state.week.tradeList = action.payload.tradeList;
      })
      .addCase(fetchCalendarWeek.rejected, (state, action) => {
        state.week.loading = false;
        state.week.error = action.error.message;
      })
      .addCase(fetchCalendarDate.pending, (state) => {
        state.date.loading = true;
      })
      .addCase(fetchCalendarDate.fulfilled, (state, action) => {
        state.date.loading = false;
        state.date.data = action.payload;
      })
      .addCase(fetchCalendarDate.rejected, (state, action) => {
        state.date.loading = false;
        state.date.error = action.error.message;
      })
      // 거래 확정 처리
      .addCase(confirmTrade.pending, (state) => {
        state.confirm.loading = true;
      })
      .addCase(confirmTrade.fulfilled, (state, action) => {
        state.confirm.loading = false;
        state.confirm.success = true;
      })
      .addCase(confirmTrade.rejected, (state, action) => {
        state.confirm.loading = false;
        state.confirm.error = action.error.message;
      });
  },
});

export default calendarSlice.reducer;
