import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";
import { setShorts } from "./shortsSlice";

export const fetchShortList = createAsyncThunk(
  "shorts/fetchShorts",
  async (_, { dispatch }) => {
    try {
      const response = await baseAxios().get("/fleaon/mainShorts?page=0");
      const shortsData = response.data.content.map((short) => ({
        id: short.shortsId,
        productName: short.productName,
        productPrice: short.productPrice,
        tradePlace: short.tradePlace,
        length: short.length,
        isScrap: short.is_scrap,
        shortsThumbnail: short.shortsThumbnail,
        shortsId: short.shortsId,
      }));
      console.log(shortsData);
      dispatch(setShorts(shortsData));
    } catch (error) {
      console.error("Error fetching shorts:", error);
      throw error;
    }
  }
);
