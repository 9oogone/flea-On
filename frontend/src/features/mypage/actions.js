// src.features/mypage/actions.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

// 라이브 스크랩 목록 조회
export const fetchLiveScrap = createAsyncThunk(
  "live/fetchLiveScrap",
  async (email) => {
    const response = await baseAxios().get(`/fleaon/users/${email}/scrapLive`);
    return response.data;
  }
);

// 숏츠 스크랩 목록 조회
export const fetchShortsScrap = createAsyncThunk(
  "shorts/fetchShortsScrap",
  async (email) => {
    const response = await baseAxios().get(
      `/fleaon/users/${email}/scrapShorts`
    );
    return response.data;
  }
);
