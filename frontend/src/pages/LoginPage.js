// src/pages/LoginPage.js
import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import KakaoIcon from "../assets/images/kakao_login.svg";
import GoogleIcon from "../assets/images/google_login.svg";
import NaverIcon from "../assets/images/naver_login.svg";
import { styled } from "@mui/system";
const TitleSpan = styled("span")(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "2rem",
}));

const LoginPage = () => {
  const handleLogin = (provider) => {
    window.location.href = `https://i11b202.p.ssafy.io/oauth2/authorization/${provider}`;
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "left", marginTop: 8 }}>
      <Typography variant="h5">
        <TitleSpan>Flea:ON</TitleSpan>에
      </Typography>
      <Typography variant="h5" gutterBottom>
        오신것을 환영해요!
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="naver"
          startIcon={
            <img
              src={NaverIcon}
              alt="naver login"
              style={{ width: 24, height: 24 }}
            />
          }
          onClick={() => handleLogin("naver")}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          네이버로 계속하기
        </Button>
        <Button
          variant="contained"
          color="google"
          startIcon={
            <img
              src={GoogleIcon}
              alt="google login"
              style={{ width: 24, height: 24 }}
            />
          }
          onClick={() => handleLogin("google")}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Google로 계속하기
        </Button>
        <Button
          variant="contained"
          color="kakao"
          onClick={() => handleLogin("kakao")}
          startIcon={
            <img
              src={KakaoIcon}
              alt="kakao login"
              style={{ width: 24, height: 24 }}
            />
          }
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          카카오로 계속하기
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
