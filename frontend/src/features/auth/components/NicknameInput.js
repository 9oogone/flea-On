// src/components/NicknameInput.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNickname } from "../authSlice";
import { Button, TextField, Box } from "@mui/material";

const NicknameInput = ({ onNext }) => {
  const [nickname, setNicknameState] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const isValidNickname = nickname.length > 0;
    setIsButtonEnabled(isValidNickname);
  }, [nickname]);

  const handleSubmit = () => {
    dispatch(setNickname(nickname));
    onNext();
  };

  return (
    <Box>
      <TextField
        label="닉네임을 입력해주세요"
        value={nickname}
        onChange={(e) => setNicknameState(e.target.value)}
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

export default NicknameInput;
