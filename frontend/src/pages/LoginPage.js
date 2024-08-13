// src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import KakaoIcon from "../assets/images/kakao_login.svg";
import GoogleIcon from "../assets/images/google_login.svg";
import NaverIcon from "../assets/images/naver_login.svg";
import { styled } from "@mui/system";
import Tooltip from "../components/ToolTip";

const TitleSpan = styled("span")(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "2rem",
}));

const LoginPage = () => {
  const [recentLogin, setRecentLogin] = useState('');
  const handleLogin = (provider) => {
    localStorage.setItem("recentLogin", provider);
    setTimeout(() => {
      window.location.href = `https://i11b202.p.ssafy.io/oauth2/authorization/${provider}`;
    }, 100);
  };
  useEffect(()=>{
    setRecentLogin(localStorage.getItem("recentLogin"));
  })

  return (
    <Container maxWidth="sm" sx={{ textAlign: "left", marginTop: 20 }}>
      <Typography>
        <TitleSpan sx={{
          letterSpacing: '-0.5px',
          fontWeight: 'bold',
          fontSize: '30px'
        }}>Flea:ON</TitleSpan><TitleSpan sx={{
          letterSpacing: '-0.5px',
          fontWeight: '400',
          fontSize: '30px',
          color: 'rgba(44, 44, 46, 1)'
        }}>에</TitleSpan>
      </Typography>
      <Typography variant="h5" gutterBottom 
      sx={{ letterSpacing: '-2px',
        color:'rgba(44, 44, 46, 1)',
        fontWeight: '400',
        fontSize: '30px',
       }}>
        오신 것을 환영해요!
      </Typography>
      <Box mt={8}>
        <Button
          variant="contained"
          color="naver"
          startIcon={
            <img
              src={NaverIcon}
              alt="naver login"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={() => handleLogin("naver")}
          fullWidth
          sx={{
            marginBottom: 2,
            width: '100%', 
            height: '58px',
            color: 'white',
            borderRadius: '0',
            boxShadow: 'none',
            fontSize: '15px',
            letterSpacing: '-0.5px',
            fontFamily: 'Noto Sans KR'
          }}
        >{localStorage.getItem("recentLogin")==='naver'&&<Tooltip/>}
          네이버로 계속하기
        </Button>
        <Button
          variant="contained"
          color="google"
          startIcon={
            <img
              src={GoogleIcon}
              alt="google login"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={() => handleLogin("google")}
          fullWidth
          sx={{
            marginBottom: 2,
            width: '100%', 
            height: '58px',
            borderRadius: '0',
            boxShadow: 'none',
            border: '0.01px solid #D9D9D9',
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.85)',
            letterSpacing: '-1.5px',
            fontFamily: 'Noto Sans KR'
          }}
        >{localStorage.getItem("recentLogin")==='google'&&<Tooltip/>}
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
              style={{ width: 20, height: 20 }}
            />
          }
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
            height: '58px',
            borderRadius: '0',
            boxShadow: 'none',
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.85)',
            letterSpacing: '-0.5px',
            fontFamily: 'Noto Sans KR'
          }}
        >{localStorage.getItem("recentLogin")==='kakao'&&<Tooltip/>}
          카카오로 계속하기
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
