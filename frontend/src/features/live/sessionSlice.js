// src/features/live/sessionSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: null,
  reducers: {
    setSession: (state, action) => action.payload,
    clearSession: () => null,
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
