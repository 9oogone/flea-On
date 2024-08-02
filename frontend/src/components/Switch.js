import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTab } from "../features/home/contentSlice";
import { ButtonGroup, Button } from "@mui/material";

const Switch = ({ options }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.content.selectedTab);

  const handleSwitch = (tab) => {
    dispatch(switchTab(tab));
  };

  return (
    <ButtonGroup
      variant="contained"
      sx={{
        backgroundColor: "white",
        height: 36,
        p: 0.3,
        borderRadius: "100px",
        overflow: "hidden",
        "& .MuiButtonGroup-grouped": {
          borderRadius: "100px !important", // 모든 버튼에 둥근 테두리를 적용
          minWidth: "50%", // 버튼을 동일한 크기로 설정
          borderRight: "none !important", // 오른쪽 경계선 제거
        },
      }}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleSwitch(option.value)}
          color={selectedTab === option.value ? "primary" : "google"}
          sx={{ width: "50%" }}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default Switch;
