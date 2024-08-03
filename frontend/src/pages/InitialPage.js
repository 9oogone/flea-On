// src/pages/InitialPage.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Typography } from "@mui/material";
import PhoneInput from "../features/auth/components/PhoneInput";
import NicknameInput from "../features/auth/components/NicknameInput";
import UserRegionInput from "../features/auth/components/UserRegionInput";

const InitialPage = () => {
  const [step, setStep] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <Container sx={{}}>
      <Typography variant="h5" sx={{ fontWeight: 1000, mt: 20 }}>
        추가 정보를 입력해주세요!
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
        몇 가지 정보를 더 입력해 주시면,
      </Typography>
      <Typography variant="body2" sx={{ color: "gray", mb: 5 }}>
        flea:ON을 더욱 편리하게 이용하실 수 있습니다
      </Typography>
      {step === 0 && !user.phone && <PhoneInput onNext={nextStep} />}
      {step === 1 && !user.nickname && <NicknameInput onNext={nextStep} />}
      {step === 2 && !user.user_region && <UserRegionInput />}
      <Typography
        align="center"
        variant="body2"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        추가 정보를 입력하시고, 다양한 중고 물품 거래를 시작해보세요!
      </Typography>
    </Container>
  );
};

export default InitialPage;
