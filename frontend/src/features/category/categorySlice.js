import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    loading: false,
    categories: [],
    error: null,
  },
  reducers: {
    fetchCategoriesRequest: (state) => {
      state.loading = true;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} = categorySlice.actions;

export const fetchCategories = (token) => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await axios.get(
      "http://i11b202.p.ssafy.io/fleaon/mainCategory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchCategoriesSuccess(response.data));
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message));
  }
};

export default categorySlice.reducer;
