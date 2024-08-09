import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../features/auth/components/PhoneInput";
import NicknameInput from "../features/auth/components/NicknameInput";
import UserRegionInput from "../features/auth/components/UserRegionInput";
import baseAxios from "../utils/httpCommons";
const InitialPage = () => {
  const [step, setStep] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.phone) setStep(1);
    if (user.nickname) setStep(2);
  }, [user]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleFinalSubmit = async () => {
    navigate("/welcome");
  };

  return (
    <Container>
      <Typography
        variant="h5"
        sx={{ fontWeight: 1000, mt: step < 2 ? 20 : 10 }}
      >
        추가 정보를 입력해주세요!
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
        몇 가지 정보를 더 입력해 주시면,
      </Typography>
      <Typography variant="body2" sx={{ color: "gray", mb: 4 }}>
        flea:ON을 더욱 편리하게 이용하실 수 있습니다
      </Typography>
      {step === 0 && !user.phone && <PhoneInput onNext={nextStep} />}
      {step === 1 && !user.nickname && <NicknameInput onNext={nextStep} />}
      {step === 2 && <UserRegionInput />}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {step === 2 && (
          <Button
            onClick={handleFinalSubmit}
            variant={
              step === 2 &&
              (!user.dongName ||
                user.dongName.length === 0 ||
                user.dongName.length > 3)
                ? "outlined"
                : "contained"
            }
            color={
              step === 2 &&
              (!user.dongName ||
                user.dongName.length === 0 ||
                user.dongName.length > 3)
                ? "primary"
                : "secondary"
            }
            disabled={
              step === 2 &&
              (!user.dongName ||
                user.dongName.length === 0 ||
                user.dongName.length > 3)
            }
            fullWidth
          >
            계속하기
          </Button>
        )}
      </Box>
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
