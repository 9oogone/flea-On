import { createSlice } from "@reduxjs/toolkit";
import levelBaby from "../../assets/images/level_baby.svg";
import levelSmall from "../../assets/images/level_small.svg";
import levelMiddle from "../../assets/images/level_middle.svg";
import levelBig from "../../assets/images/level_big.svg";
const levels = [
  {
    name: "아기손",
    minSales: 0,
    maxSales: 1,
    icon: levelBaby,
  },
  {
    name: "작은손",
    minSales: 2,
    maxSales: 5,
    icon: levelSmall,
  },
  {
    name: "중간손",
    minSales: 7,
    maxSales: 25,
    icon: levelMiddle,
  },
  {
    name: "큰손",
    minSales: 26,
    maxSales: "MAX",
    icon: levelBig,
  },
];

const levelSlice = createSlice({
  name: "level",
  initialState: {
    salesCount: 0,
    level: levels[0].name,
    nextLevel: levels[1].name,
    levelIcon: levels[0].icon,
    nextLevelIcon: levels[1].icon,
    salesGoal: levels[0].maxSales,
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
        currentLevel.maxSales === "MAX" ? "MAX" : currentLevel.maxSales;
    },
  },
});

export const { updateSalesCount } = levelSlice.actions;
export default levelSlice.reducer;
