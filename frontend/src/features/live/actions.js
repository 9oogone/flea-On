// src/features/live/actions.js
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 상품 카테고리 조회 액션
export const fetchCategories = createAsyncThunk(
  "live/fetchCategories",
  async (productName, { getState }) => {
    const state = getState();
    const accessToken = state.auth.token;
    const response = await axios.get(
      `https://i11b202.p.ssafy.io/fleaon/naver/api/search?query=${productName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// 라이브 방송 생성 액션
export const createLiveBroadcast = createAsyncThunk(
  "live/createLiveBroadcast",
  async (formData, { getState }) => {
    console.log(formData);
    const state = getState();
    const accessToken = state.auth.token;

    const response = await axios.post(
      "https://i11b202.p.ssafy.io/fleaOn/live/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
);
