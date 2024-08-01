import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, thunkAPI) => {
    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
