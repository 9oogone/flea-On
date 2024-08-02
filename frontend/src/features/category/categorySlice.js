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

export const fetchCategories = () => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await axios.get("http://localhost:5000/api/categories");
    const transformedData = response.data.results.map((item, index) => ({
      id: index,
      name: item.title,
      param: item.category[0],
    }));
    dispatch(fetchCategoriesSuccess(transformedData));
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message));
  }
};

export default categorySlice.reducer;
