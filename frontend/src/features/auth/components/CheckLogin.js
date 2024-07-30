import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../authSlice"; // setToken 액션 임포트

const CheckLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParam("access_token");
    console.log("access_token : ", token);
    if (token) {
      localStorage.setItem("access_token", token);
      dispatch(login(token)); // 리덕스 스토어에 토큰 저장
      console.log("login_token : ", token);
      //   navigate("/main"); // 메인 페이지로 리다이렉트
    } else {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      console.log("access_token : ", token);
      //   navigate("/login");
    }
  }, [dispatch, navigate]);

  function searchParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  return <div>Checking login status...</div>;
};

export default CheckLogin;
