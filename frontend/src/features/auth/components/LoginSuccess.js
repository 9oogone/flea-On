// src/features/auth/components/LoginSuccess.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSocialLogin } from "../actions";

const LoginSuccess = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const username = query.get("username");
    const role = query.get("role");

    if (token && username && role) {
      dispatch(handleSocialLogin({ token, user: { username, role } }));
      navigate("/");
    }
  }, [dispatch, location, navigate]);

  return <div>Login Successful! Redirecting...</div>;
};

export default LoginSuccess;
