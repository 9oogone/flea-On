import React from "react";
import { useSelector } from "react-redux";
import Switch from "../../../components/Switch";
import Buys from "./Buys.js";
import Waits from "./BuyWaits.js";
import { Container, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const BuyList = () => {
  const selectedTab = useSelector((state) => state.content.selectedTab);
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
  return (
    <Container sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          width: "100%",
          pb: 5,
        }}
      >
        <ArrowBackIosNewIcon sx={{ position: "absolute", left: "16px" }} />
        <Typography
          sx={{
            margin: "0 auto",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "24px",
            fontWeight: "600",
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
          <Switch options={switchOptions} />
        </Box>
      </Box>
    </Container>
  );
};

export default BuyList;
