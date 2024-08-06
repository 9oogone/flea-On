import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Switch from "../../../components/Switch";
import Buys from "./Buys.js";
import Waits from "./BuyWaits.js";
import { Container, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../buylistSlice.js";

const BuyList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.buy.selectedTab);
  const contents = {
    buys: [
      {
        id: "1",
        name: "빨래건조대",
        price: "4000",
        place: "중리동",
        date: "2024-08-07",
        time: "13:00:00",
        live_id: 5,
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
        time: "13:00:00",
        live_id: 4,
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
        time: "13:00:00",
        live_id: 4,
      },
    ],
    waits: [
      {
        id: "1",
        name: "빨래건조대",
        price: "4000",
        place: "중리동",
        date: "2024-08-07",
        live_id: 5,
      },
      {
        id: "2",
        name: "아이패드",
        price: "60000",
        place: "중리동",
        date: "2024-08-05",
        live_id: 4,
      },
      {
        id: "3",
        name: "아이패드",
        price: "66000",
        place: "중리동",
        date: "2024-08-03",
        live_id: 4,
      },
    ],
  };
  const switchOptions = [
    { value: "buys", label: "구매" },
    { value: "waits", label: "줄서기" },
  ];

  const handleBackButtonClick = () => {
    // 이전 페이지로 이동
    navigate("/mypage");
    // 상태 초기화
    dispatch(switchTab("buys"));
  };
  return (
    <Container sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          pb: 5,
          position: "relative",
        }}
      >
        <Box
          onClick={handleBackButtonClick}
          sx={{
            cursor: "pointer",
            position: "absolute",
            left: 0,
          }}
        >
          <ArrowBackIosNewIcon />
        </Box>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          구매내역
        </Typography>
      </Box>
      <Box>
        {selectedTab === "buys" && <Buys items={contents.buys} />}
        {selectedTab === "waits" && <Waits items={contents.waits} />}
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Switch options={switchOptions} type="buy" />
        </Box>
      </Box>
    </Container>
  );
};

export default BuyList;
