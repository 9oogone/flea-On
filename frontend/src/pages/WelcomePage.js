import React from "react";
import { useSelector } from "react-redux";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/");
  };

  return (
    <Container sx={{ mt: 20 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        안녕하세요!
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {user?.nickname}님
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12, mt: 2, color: "gray" }}>
        실시간 라이브로 즐거운 중고거래를 시작해보세요!
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 10, height: 50 }}
        fullWidth
        onClick={handleStartClick}
      >
        Flea:ON 시작하기
      </Button>
    </Container>
  );
};

export default WelcomePage;
