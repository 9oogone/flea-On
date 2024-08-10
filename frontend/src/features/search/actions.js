import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, thunkAPI) => {
    try {
      const response = await baseAxios().get(`/fleaon/searchResult?name=${query}`);
      return response.data; // Axios automatically parses JSON response
    } catch (error) {
      if (error.response && error.response.status === 500) {
        return thunkAPI.rejectWithValue("500");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
