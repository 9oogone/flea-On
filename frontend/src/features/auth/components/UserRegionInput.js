// src/components/UserRegionInput.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserRegion } from "../authSlice";
import { Button, TextField, Box } from "@mui/material";

const UserRegionInput = () => {
  const [userRegion, setUserRegionState] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setUserRegion(userRegion));
  };
  const regions = { sido: ["서울", "경기", "대전"] };
  return (
    <Box>
      <TextField
        label="Region"
        value={userRegion}
        onChange={(e) => setUserRegionState(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default UserRegionInput;
