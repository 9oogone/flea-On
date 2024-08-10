import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, thunkAPI) => {
    try {
      const encodedQuery = encodeURIComponent(query); // 쿼리 인코딩
      const response = await baseAxios().get(`/fleaon/searchResult?name=${encodedQuery}`);
      return response.data; // Axios automatically parses JSON response
    } catch (error) {
      console.error("Fetch Search Results Error:", error); // 콘솔에 에러 출력
      if (error.response && error.response.status === 500) {
        return thunkAPI.rejectWithValue("500");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
