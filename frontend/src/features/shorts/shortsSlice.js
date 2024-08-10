import { createSlice } from "@reduxjs/toolkit";
import { fetchShorts } from "./actions";

const initialState = {
  currentShort: null,
  shorts: [],
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
        short.id === shortsId ? { ...short, is_scrap: !short.is_scrap } : short
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShorts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShorts.fulfilled, (state, action) => {
        state.loading = false;
        state.shorts = action.payload;
      })
      .addCase(fetchShorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentShort, setShorts, toggleScrap } = shortsSlice.actions;
export default shortsSlice.reducer;
