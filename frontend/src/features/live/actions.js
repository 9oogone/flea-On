// src/features/live/actions.js
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// 상품 카테고리 조회 액션
export const fetchCategories = createAsyncThunk('live/fetchCategories', async (productName) => {
  const response = await axios.get(`/api/categories?productName=${productName}`);
  return response.data;
});

// 라이브 방송 생성 액션
export const createLiveBroadcast = createAsyncThunk(
    'live/createLiveBroadcast',
    async (formData, { getState }) => {
      const state = getState();
      const accessToken = state.auth.token;
      
      const response = await axios.post(
        'https://i11b202.p.ssafy.io/fleaOn/live/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    }
  );