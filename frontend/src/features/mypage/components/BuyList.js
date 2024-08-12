import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDidMountEffect from "../../../utils/useDidMountEffect.js";

import { fetchBuys, fetchWaits } from "../actions.js";
import Switch from "../../../components/Switch";
import Buys from "./Buys.js";
import Waits from "./BuyWaits.js";
import { Container, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../buySlice.js";

const BuyList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.buy.selectedTab);
  const buys = useSelector((state) => state.buy.buys.data);
  const waits = useSelector((state) => state.buy.waits.data);
  const email = useSelector((state) => state.auth.user.email);
  useDidMountEffect(() => {
    dispatch(fetchBuys(email));
    dispatch(fetchWaits(email));
  }, [dispatch]);
  console.log(buys);
  console.log(buys[0]);
  console.log(buys[1]);

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
    </Container>
  );
};

export default BuyList;
