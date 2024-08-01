import { createSlice } from "@reduxjs/toolkit";

const levelSlice = createSlice({
  name: "level",
  initialState: {
    salesCount: 0,
    level: "기본손",
    nextLevel: "아기손",
    levelIcon: "../../assets/images/level_baby.svg",
  },
  reducers: {
    updateSalesCount: (state, action) => {
      const salesCount = action.payload;
      let level;
      let nextLevel;
      let levelIcon;

      if (salesCount === 0) {
        level = "기본손";
        nextLevel = "아기손";
        levelIcon: "../../assets/images/level_baby.svg";
      } else if (salesCount >= 1 && salesCount <= 3) {
        level = "아기손";
        nextLevel = " 중간손";
        levelIcon: "../../assets/images/level_small.svg.svg";
      } else if (salesCount > 3 && salesCount <= 23) {
        level = "중간손";
        nextLevel = "큰손";
        levelIcon: "../../assets/images/level_middle.svg.svg";
      } else {
        level = "큰손";
        nextLevel = null;
        levelIcon: "../../assets/images/level_big.svg.svg";
      }
      state.salesCount = salesCount;
      state.level = level;
    },
  },
});

export const { updateSalesCount } = levelSlice.actions;
export default levelSlice.reducer;
