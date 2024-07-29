// src/features/auth/components/LoginPage.js
import React from "react";

const LoginPage = () => {
  const handleLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <button onClick={() => handleLogin("naver")}>Login with Naver</button>
        <button onClick={() => handleLogin("google")}>Login with Google</button>
        <button onClick={() => handleLogin("kakao")}>Login with Kakao</button>
      </div>
    </div>
  );
};

export default LoginPage;
