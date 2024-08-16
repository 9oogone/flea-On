import { createSlice } from "@reduxjs/toolkit";
import { fetchSidos, fetchGuguns, fetchEupmyeons } from "./actions";

const initialState = {
  sidos: [],
  guguns: {},
  eupmyeons: {},
  region_info: [],
  loading: false,
  error: null,
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setSidos(state, action) {
      state.sidos = action.payload;
    },
    setGuguns(state, action) {
      const { sidoName, guguns } = action.payload;
      state.guguns[sidoName] = guguns;
    },
    setEupmyeons(state, action) {
      const { sidoName, gugunName, eupmyeons } = action.payload;
      if (!state.eupmyeons[sidoName]) {
        state.eupmyeons[sidoName] = {};
      }
      state.eupmyeons[sidoName][gugunName] = eupmyeons;
    },
    setRegionInfo(state, action) {
      state.region_info = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSidos.fulfilled, (state, action) => {
        state.loading = false;
        state.sidos = action.payload;
      })
      .addCase(fetchSidos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGuguns.fulfilled, (state, action) => {
        state.guguns[action.payload.sidoName] = action.payload.guguns;
      })
      .addCase(fetchEupmyeons.fulfilled, (state, action) => {
        const { sidoName, gugunName, eupmyeons } = action.payload;
        if (!state.eupmyeons[sidoName]) {
          state.eupmyeons[sidoName] = {};
        }
        state.eupmyeons[sidoName][gugunName] = eupmyeons;
        state.region_info = eupmyeons;
      });
  },
});

export const {
  setSidos,
  setGuguns,
  setEupmyeons,
  setRegionInfo,
  setLoading,
  setError,
} = regionSlice.actions;

export default regionSlice.reducer;
