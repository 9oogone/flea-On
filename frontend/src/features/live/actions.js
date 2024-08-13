// src/features/live/actions.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";

// 상품 카테고리 조회 액션
export const fetchCategories = createAsyncThunk(
  "live/fetchCategories",
  async (productName) => {
    const response = await baseAxios().get(
      `/fleaon/naver/api/search?query=${productName}`
    );
    console.log(response.data);
    return response.data;
  }
);

// 라이브 방송 생성 액션
export const createLiveBroadcast = createAsyncThunk(
  "live/createLiveBroadcast",
  async (formData) => {
    const response = await baseAxios().post("/fleaOn/live/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

// 라이브 상세 조회
export const fetchLiveDetail = createAsyncThunk(
  "live/fetchLiveDetail",
  async (liveID) => {
    const response = await baseAxios().get(`/fleaOn/live/${liveID}/detail`);
    // console.log("액시오스 입니다");
    // console.log(response.data);
    return response.data;
  }
);
