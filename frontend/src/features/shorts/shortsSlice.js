import { createSlice } from "@reduxjs/toolkit";
import { fetchShortList } from "./actions";

const initialState = {
  currentShort: null,
  shorts: [],
  loading: false,
  error: null,
};

const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {
    setCurrentShort: (state, action) => {
      state.currentShort = action.payload;
    },
    setShorts: (state, action) => {
      console.log(action.payload);
      state.shorts = action.payload;
      console.log(state.shorts);
    },
    toggleScrap: (state, action) => {
      const { shortsId } = action.payload;
      state.shorts = state.shorts.map((short) =>
        short.id === shortsId ? { ...short, isScrap: !short.isScrap } : short
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShortList.fulfilled, (state, action) => {
        state.loading = false;
        state.shorts = action.payload;
      })
      .addCase(fetchShortList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentShort, setShorts, toggleScrap } = shortsSlice.actions;
export default shortsSlice.reducer;
