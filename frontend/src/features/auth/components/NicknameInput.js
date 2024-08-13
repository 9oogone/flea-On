// src/components/NicknameInput.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNickname, updateUserInfo } from "../authSlice";
import { Button, TextField, Box } from "@mui/material";

const NicknameInput = ({ onNext }) => {
  const [nickname, setNicknameState] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const isValidNickname = nickname.length > 0;
    setIsButtonEnabled(isValidNickname);
  }, [nickname]);

  const handleSubmit = () => {
    dispatch(setNickname(nickname));
    dispatch(updateUserInfo({ email: user.email, data: { nickname } }));

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
        sx = {{
          boxShadow: "none",
          width: "100%",
          height: "46px",
          letterSpacing: "-0.5px"
        }} 
      >
        계속하기
      </Button>
    </Box>
  );
};

export default NicknameInput;
