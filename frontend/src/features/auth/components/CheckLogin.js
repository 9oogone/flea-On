import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { performLogin } from "../actions";

const CheckLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/initial"); // 이미 로그인 상태라면 메인 페이지로 리다이렉트
    } else {
      const token = searchParam("access_token");
      if (token) {
        // 여기서 액션을 디스패치하여 URL의 토큰을 Redux 스토어에 저장
        dispatch(performLogin({ token }));
        navigate("/initial"); // 메인 페이지로 리다이렉트
      } else {
        navigate("/login"); // 토큰이 없으면 로그인 페이지로 리다이렉트
      }
    }
  }, [dispatch, navigate, isAuthenticated]);

  function searchParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  return <div>Checking login status...</div>;
};

export default CheckLogin;
