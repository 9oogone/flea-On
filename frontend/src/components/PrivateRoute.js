// src/components/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  console.log("PrivateRoute isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute isLoading:", isLoading);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
