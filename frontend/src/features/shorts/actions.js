import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShorts } from "./shortsSlice";
import baseAxios from "../../utils/httpCommons";

export const fetchShorts = createAsyncThunk(
  "shorts/fetchShorts",
  async (_, { dispatch }) => {
    try {
      const response = await baseAxios().get("/fleaon/mainShorts");
      const shortsData = response.data.content.map((short) => ({
        id: short.shortsId,
        name: short.productName,
        price: short.productPrice,
        trade_place: short.tradePlace,
        length: "00:00", // 서버 데이터에 길이가 포함되어 있지 않아서 임시로 00:00으로 설정
        is_scrap: false, // 기본값으로 설정
        thumbnail: short.thumbnail,
        shorts_id: short.shortsId,
      }));
      console.log(shortsData);
      dispatch(setShorts(shortsData));
    } catch (error) {
      console.error("Error fetching shorts:", error);
      throw error;
    }
  }
);
