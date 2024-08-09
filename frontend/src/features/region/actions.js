import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

export const fetchSidos = createAsyncThunk("region/fetchSidos", async () => {
  const response = await baseAxios().get("/fleaon/sidoName");
  console.log(response);
  return response.data;
});

export const fetchGuguns = createAsyncThunk(
  "region/fetchGuguns",
  async (sidoName) => {
    const response = await baseAxios().get(`/fleaon/${sidoName}/gugun`);
    return { sidoName, guguns: response.data };
  }
);

export const fetchEupmyeons = createAsyncThunk(
  "region/fetchEupmyeons",
  async ({ sidoName, gugunName }) => {
    const response = await baseAxios().get(
      `/fleaon/${sidoName}/${gugunName}/eupmyeon`
    );
    return { sidoName, gugunName, eupmyeons: response.data };
  }
);
