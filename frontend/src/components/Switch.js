import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTab as switchContentTab } from "../features/home/contentSlice";
import { switchTab as switchBuyTab } from "../features/mypage/buylistSlice";
import { switchTab as switchSellTab } from "../features/mypage/selllistSlice";
import { switchTab as switchWatchTab } from "../features/mypage/scrapSlice";
import { ButtonGroup, Button } from "@mui/material";

const Switch = ({ options, type }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => {
    switch (type) {
      case "content":
        return state.content.selectedTab;
      case "buy":
        return state.buy.selectedTab;
      case "sell":
        return state.sell.selectedTab;
      case "scrap":
        return state.scrap.selectedTab;
      default:
        return null;
    }
  });

  // console.log(`Selected Tab for ${type}:`, selectedTab); //타입 잘 먹고있나 확인

  const handleSwitch = (tab) => {
    if (type === "content") {
      dispatch(switchContentTab(tab));
    } else if (type === "buy") {
      dispatch(switchBuyTab(tab));
    } else if (type === "sell") {
      dispatch(switchSellTab(tab));
    } else if (type === "scrap") {
      dispatch(switchWatchTab(tab));
    }
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
          whiteSpace: "nowrap", // 줄 바꿈을 방지합니다.
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
