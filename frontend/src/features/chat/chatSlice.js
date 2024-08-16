import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

const initialState = {
  chats: [],
  status: "idle",
  error: null,
  noChats: false,
};

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios().get("/fleaon/chat");
      console.log("챗룸 연결입니다. ", response.data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return rejectWithValue("noChats");
      }
      throw err;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
        state.noChats = false;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        if (action.payload === "noChats") {
          state.status = "succeeded";
          state.noChats = true;
        } else {
          state.status = "failed";
          state.error = action.error.message;
        }
      });
  },
});

export default chatSlice.reducer;
