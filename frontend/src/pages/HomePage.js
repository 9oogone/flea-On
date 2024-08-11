// HomePage.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Switch from "../components/Switch";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
import { Grid, Box, Button, Container } from "@mui/material";
import baseAxios from "../utils/httpCommons";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../features/auth/actions";
import { fetchShorts } from "../features/shorts/actions";
const HomePage = () => {
  const selectedTab = useSelector((state) => state.content.selectedTab);
  // const contents = useSelector((state) => state.content.contents);
  const [hasLive, setHasLive] = useState(false);
  const [liveId, setLiveId] = useState(null);
  const [shorts, setShorts] = useState([]);
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLiveExistence = async () => {
      try {
        const response = await baseAxios().get(
          "/fleaon/users/commerceLive/expected"
        );
        setHasLive(response.data.exist);
        setLiveId(response.data.liveId);
      } catch (error) {
        console.error("Error checking live existence", error);
      }
    };

    checkLiveExistence();
  }, []);
  const startLiveBroadcast = async (liveId) => {
    try {
      await baseAxios().put(`/fleaOn/live/${liveId}/on`);
      navigate(`/live/${liveId}`);
    } catch (error) {
      console.error("Failed to start live broadcast", error);
    }
  };

  const fetchShorts = async () => {
    try {
      const response = await baseAxios().get("/fleaon/mainShorts");
      const shortsData = response.data.content.map((short) => ({
        id: short.shortsId,
        name: short.productName,
        price: short.productPrice,
        trade_place: short.tradePlace,
        length: short.length, // 서버 데이터에 길이가 포함되어 있지 않아서 임시로 00:00으로 설정
        is_scrap: short.is_scrap, // 기본값으로 설정
        thumbnail: short.thumbnail,
        shorts_id: short.shortsId,
      }));

      setShorts(shortsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shorts:", error);
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchLiveData = async () => {
    try {
      const response = await baseAxios().get("/fleaon/mainLive");
      const liveData = response.data.content.map((liveItem) => ({
        id: liveItem.liveId,
        title: liveItem.liveTitle,
        productNames: liveItem.productNames,
        productPrices: liveItem.productPrices,
        tradePlace: liveItem.tradePlace,
        isLive: liveItem.isLive,
        thumbnail: liveItem.liveThumbnail,
        scrap: liveItem.scrap,
      }));

      setLive(liveData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo()); // 사용자 정보 가져오기
    fetchShorts(); // 숏츠 데이터 가져오기
    fetchLiveData();
  }, [dispatch]);

  const contents = {
    live: live,
    shorts: shorts,
  };
  const switchOptions = [
    { value: "live", label: "Live" },
    { value: "shorts", label: "Shorts" },
  ];

  return (
    <Container>
      <Grid container sx={{ marginTop: "12vh" }}>
        {hasLive ? (
          <Grid
            item
            xs={12}
            sx={{
              mr: 2,
              p: 1,
              ml: 2,
              mb: 2,
              borderRadius: 2,
              background:
                "linear-gradient(100deg, rgba(255, 87, 87, 0.18) 50%, rgba(255, 11, 85, 0.18) 100%)",
            }}
          >
            <Grid container>
              <Grid item xs={8}>
                <Box>방송시간입니다</Box>
                <Box>시청자들이 기다리고 있어요!</Box>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => startLiveBroadcast(liveId)}
                >
                  시작하기
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Box></Box>
        )}
        {selectedTab === "live" && <LiveBroadcasts items={contents.live} />}
        {selectedTab === "shorts" && <Shorts items={contents.shorts} />}
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Switch options={switchOptions} type="content" />
        </Box>
      </Grid>
    </Container>
  );
};

export default HomePage;
