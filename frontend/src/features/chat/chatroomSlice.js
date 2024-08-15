import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

const initialState = {
  chatRoom: null,
  status: "idle",
  error: null,
};

export const fetchChatRoom = createAsyncThunk(
  "chatRoom/fetchChatRoom",
  async (chatID, { rejectWithValue }) => {
    try {
      const response = await baseAxios().get(`/fleaon/chat/messages`, {
        params: { chattingId: chatID },
      });
      // console.log('나와라:', chatID)
      return response.data;
    } catch (err) {
      console.error("에러 sending message:", err);
      return rejectWithValue(err.response.data);
    }
  }
);

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chatRoom = action.payload;
      })
      .addCase(fetchChatRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default chatRoomSlice.reducer;
