import { createSlice } from "@reduxjs/toolkit";
import { fetchSearchResults } from "./actions";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    loading: false,
    results: {
      upcoming: [],
      shorts: [],
      live: [],
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;
