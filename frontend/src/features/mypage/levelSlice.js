import { createSlice } from "@reduxjs/toolkit";

const levelSlice = createSlice({
  name: "level",
  initialState: {
    salesCount: 0,
    level: "기본손",
  },
  reducers: {
    updateSalesCount: (state, action) => {
      const salesCount = action.payload;
      let level;
      if (salesCount === 0) {
        level = "기본손";
      } else if (salesCount >= 1 && salesCount <= 3) {
        level = "아기손";
      } else if (salesCount > 3 && salesCount <= 20) {
        level = "중간손";
      } else {
        level = "큰손";
      }
      state.salesCount = salesCount;
      state.level = level;
    },
  },
});

export const { updateSalesCount } = levelSlice.actions;
export default levelSlice.reducer;
