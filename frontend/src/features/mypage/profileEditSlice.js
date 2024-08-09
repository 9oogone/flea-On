import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseAxios from '../../utils/httpCommons';

export const updateProfile = createAsyncThunk(
  'profileEdit/updateProfile',
  async ({ email, profileData }, { rejectWithValue }) => {
    try {
      const response = await baseAxios().put(`/fleaon/users/${email}/info`, profileData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const profileEditSlice = createSlice({
  name: 'profileEdit',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profileEditSlice.reducer;
