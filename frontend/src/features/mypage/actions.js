// src.features/mypage/actions.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import baseAxios from "../../utils/httpCommons";
import FormControlContext from "@mui/material/FormControl/FormControlContext";

// 캘린더 주별 거래 조회
export const fetchCalendarWeek = createAsyncThunk(
  "calendar/fetchCalendarWeek",
  async ({ email, today }) => {
    const response = await baseAxios().get(`/fleaon/users/${email}/mypage`, {
      params: { today: today },
    });
    return response.data;
  }
);

// 캘린더 일별 거래 조회
export const fetchCalendarDate = createAsyncThunk(
  "calendar/fetchCalendarDate",
  async ({ email, tradeDate }) => {
    console.log(email, tradeDate, "뭐지");
    // email과 date를 객체로 받아옴
    const response = await baseAxios().get(
      `/fleaon/users/${email}/${tradeDate}/schedule`
    );
    // console.log(response.data);
    return response.data;
  }
);

// 캘린더 거래 확정 포스트
export const confirmTrade = createAsyncThunk(
  "trade/confirmTrade",
  async (tradeData) => {
    console.log(tradeData, "거래 확정 데이터 입니다.");
    const response = await baseAxios().post(
      "/fleaon/purchase/confirmTrade",
      tradeData
    );
    console.log(response.data, "잘 들어갔나요....");
    return response.data;
  }
);

// 구매 목록 조회
export const fetchBuys = createAsyncThunk("buy/fetchBuys", async (email) => {
  const response = await baseAxios().get(`/fleaon/users/${email}/purchaseList`);
  return response.data;
});

// 줄서기 목록 조회
export const fetchWaits = createAsyncThunk("buy/fetchWaits", async (email) => {
  const response = await baseAxios().get(
    `/fleaon/users/${email}/reservationList`
  );
  return response.data;
});

// 판매 라이브 목록 조회
export const fetchSellLive = createAsyncThunk(
  "sell/fetchSellLive",
  async (email) => {
    const response = await baseAxios().get(`/fleaon/users/${email}/commerceLive
`);
    return response.data;
  }
);

// 판매 쇼츠 목록 조회
export const fetchSellShorts = createAsyncThunk(
  "sell/fetchSellShorts",
  async (email) => {
    const response = await baseAxios().get(`/fleaon/users/${email}/shorts`);
    return response.data;
  }
);

// 라이브 스크랩 목록 조회
export const fetchLiveScrap = createAsyncThunk(
  "scrap/fetchLiveScrap",
  async (email) => {
    const response = await baseAxios().get(`/fleaon/users/${email}/scrapLive`);
    return response.data;
  }
);

// 숏츠 스크랩 목록 조회
export const fetchShortsScrap = createAsyncThunk(
  "scrap/fetchShortsScrap",
  async (email) => {
    const response = await baseAxios().get(
      `/fleaon/users/${email}/scrapShorts`
    );
    return response.data;
  }
);
