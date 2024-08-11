// src/features/mypage/calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchCalendarWeek, fetchCalendarDate } from "./actions";
const initialState = {
  week: {
    loading: false,
    data: [],
    error: null,
  },
  date: {
    loading: false,
    data: [],
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
        state.week.data = action.payload;
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
      });
  },
});

export default calendarSlice.reducer;
