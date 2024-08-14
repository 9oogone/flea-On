import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLiveScrap, fetchShortsScrap } from "../actions.js";
import Switch from "../../../components/Switch";
import ScrapLive from "./ScrapLive.js";
import ScrapShorts from "./ScrapShorts.js";
import { Container, Box, Grid, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { switchTab } from "../scrapSlice.js";

const ScrapList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.scrap.selectedTab);
  const liveScrap = useSelector((state) => state.scrap.liveScrap.data);
  const shortsScrap = useSelector((state) => state.scrap.shortsScrap.data);
  const email = useSelector((state) => state.auth.user.email);

  useEffect(() => {
    dispatch(fetchLiveScrap(email));
    dispatch(fetchShortsScrap(email));
  }, [dispatch, email]);

  const switchOptions = [
    { value: "live", label: "LIVE" },
    { value: "shorts", label: "SHORTS" },
  ];

  const handleBackButtonClick = () => {
    // 이전 페이지로 이동
    navigate("/mypage");
    // 상태 초기화
    dispatch(switchTab("live"));
  };

  return (
    <Box sx={{ mb: 18 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          width: "100%",
          pt: 6,
          pb: 3,
          left: 0,
          backgroundColor: "white",
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
          관심목록
        </Typography>
      </Box>

      <Grid>
        <Grid container sx={{ paddingTop: "12vh" }}>
          {selectedTab === "live" && <ScrapLive items={liveScrap} />}
          {selectedTab === "shorts" && <ScrapShorts items={shortsScrap} />}
          <Box
            sx={{
              position: "fixed",
              bottom: 100,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Switch options={switchOptions} type="scrap" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScrapList;
