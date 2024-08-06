import axios from "axios";

const BASE_SERVER_URL = "https://i11b202.p.ssafy.io/api"; // 실제 서버 URL로 변경

// const BASE_SERVER_URL = 'http://localhost:5442'; // 실제 서버 URL로 변경

function baseAxios() {
  const instance = axios.create({
    baseURL: BASE_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWRlbnRpZmllciI6Imdvb2dsZSAxMDQ3MDQ2MTg1NTYzMDIxMTE3MTAiLCJyb2xlIjoiUk9MRV9VU0VSIiwiZW1haWwiOiJxc2M3NTM5NjlAZ21haWwuY29tIiwiaWF0IjoxNzIyNTg4NzkwLCJleHAiOjE3MjI2MDE3NTB9.NomOrtwj4SBJHyNcD4RwRUF6oCDCHDyBoSYmS90sk6E",
    },
    withCredentials: true,
  });
  return instance;
}

export default baseAxios;
