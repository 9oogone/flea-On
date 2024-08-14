import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBuys, fetchWaits } from "../actions.js";
import Switch from "../../../components/Switch";
import Buys from "./Buys.js";
import Waits from "./BuyWaits.js";
import { Container, Box, Typography, Grid } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../buySlice.js";

const BuyList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.buy.selectedTab);
  const buys = useSelector((state) => state.buy.buys.data);
  const waits = useSelector((state) => state.buy.waits.data);
  const email = useSelector((state) => state.auth.user.email);

  useEffect(() => {
    dispatch(fetchBuys(email));
    dispatch(fetchWaits(email));
  }, [dispatch]);

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
    <Box sx={{ mb: 18 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "fixed",
          bgcolor: "white",
          pt: 6,
          pb: 3,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Box
          onClick={handleBackButtonClick}
          sx={{
            cursor: "pointer",
            position: "absolute",
            left: 24,
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

      <Box container sx={{ paddingTop: "12vh" }}>
        {selectedTab === "buys" && <Buys items={buys} />}
        {selectedTab === "waits" && <Waits items={waits} />}
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
    </Box>
  );
};

export default BuyList;
