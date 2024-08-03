// src/components/PhoneInput.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPhone } from "../authSlice";
import { Button, TextField, Box } from "@mui/material";

const PhoneInput = ({ onNext }) => {
  const [phone, setPhoneState] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // 전화번호가 11자리 숫자일 때만 버튼 활성화
    const isValidPhone = /^\d{11}$/.test(phone);
    setIsButtonEnabled(isValidPhone);
  }, [phone]);

  const handleSubmit = () => {
    if (isButtonEnabled) {
      dispatch(setPhone(phone));
      onNext();
    }
  };

  return (
    <Box>
      <TextField
        label="휴대폰 번호를 입력해 주세요"
        value={phone}
        onChange={(e) => setPhoneState(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ mb: 1 }}
      />
      <Button
        onClick={handleSubmit}
        variant={isButtonEnabled ? "contained" : "outlined"}
        color={isButtonEnabled ? "secondary" : "primary"}
        disabled={!isButtonEnabled}
        fullWidth
      >
        계속하기
      </Button>
    </Box>
  );
};

export default PhoneInput;
