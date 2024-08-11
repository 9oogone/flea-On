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
