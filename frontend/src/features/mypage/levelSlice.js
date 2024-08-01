import { createSlice } from "@reduxjs/toolkit";

const levels = [
  {
    name: "아기손",
    minSales: 0,
    maxSales: 1,
    icon: "../../assets/images/level_baby.svg",
  },
  {
    name: "작은손",
    minSales: 1,
    maxSales: 6,
    icon: "../../assets/images/level_small.svg",
  },
  {
    name: "중간손",
    minSales: 6,
    maxSales: 26,
    icon: "../../assets/images/level_middle.svg",
  },
  {
    name: "큰손",
    minSales: 26,
    maxSales: "MAX",
    icon: "../../assets/images/level_big.svg",
  },
];

const levelSlice = createSlice({
  name: "level",
  initialState: {
    salesCount: 0,
    level: levels[0].name,
    nextLevel: levels[1].name,
    salesGoal: levels[0].maxSales - levels[0].minSales,
    currentLevelSales: 0,
  },
  reducers: {
    updateSalesCount: (state, action) => {
      const salesCount = action.payload;
      let currentLevel, nextLevel;

      for (let i = 0; i < levels.length; i++) {
        if (salesCount < levels[i].maxSales || levels[i].maxSales === "MAX") {
          currentLevel = levels[i];
          nextLevel = levels[i + 1] || null;
          break;
        }
      }

      state.salesCount = salesCount;
      state.level = currentLevel.name;
      state.nextLevel = nextLevel ? nextLevel.name : null;
      state.levelIcon = currentLevel.icon;
      state.nextLevelIcon = nextLevel ? nextLevel.icon : null;
      state.salesGoal =
        currentLevel.maxSales === "MAX"
          ? "MAX"
          : currentLevel.maxSales - currentLevel.minSales;
      state.currentLevelSales = salesCount - currentLevel.minSales;
    },
  },
});

export const { updateSalesCount } = levelSlice.actions;
export default levelSlice.reducer;
