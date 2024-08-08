import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentShort: null,
};

const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {
    setCurrentShort: (state, action) => {
      state.currentShort = action.payload;
    },
  },
});

export const { setCurrentShort } = shortsSlice.actions;
export default shortsSlice.reducer;
