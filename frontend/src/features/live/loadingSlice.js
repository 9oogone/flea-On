import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    setLoading: (state) => true,
    unSetLoading: (state) => false,
  },
});

export const { setLoading, unSetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
