// src/utils/httpCommons.js
import axios from "axios";

const BASE_SERVER_URL = "https://i11b202.p.ssafy.io"; // 실제 서버 URL로 변경

function baseAxios() {
  const token = JSON.parse(localStorage.getItem("authState"))?.token; // localStorage에서 token을 가져옴
  const instance = axios.create({
    baseURL: BASE_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return instance;
}

export default baseAxios;
