import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Switch from "../components/Switch";
import LiveBroadcasts from "../components/LiveBroadcasts";
import Shorts from "../components/Shorts";
import { Grid, Box, Button, Container } from "@mui/material";
import baseAxios from "../utils/httpCommons";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../features/auth/actions";
import { fetchShortList } from "../features/shorts/actions";
import useDidMountEffect from "../utils/useDidMountEffect";
import { useInView } from "react-intersection-observer";

const HomePage = () => {
  const selectedTab = useSelector((state) => state.content.selectedTab);
  const [hasLive, setHasLive] = useState(false);
  const [liveId, setLiveId] = useState(null);
  const [liveTitle, setLiveTitle] = useState(null);
  const [shorts, setShorts] = useState([]);
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState();
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(0);
  const [isLast, setIsLast] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5, // 화면에 절반 이상 보이면 트리거
  });
  useEffect(() => {
    const checkLiveExistence = async () => {
      try {
        const response = await baseAxios().get(
          "/fleaon/users/commerceLive/expected"
        );
        // setHasLive(response.data.exist);
        setLiveId(response.data.liveId);
        setLiveTitle(response.data.liveTitle);
        if (response.data.liveId !== 0) {
          setHasLive(true);
        }
      } catch (error) {
        console.error("Error checking live existence", error);
      }
    };

    checkLiveExistence();
  }, []);

  useEffect(() => {
    if (inView && !scrollLoading) {
      console.log(123123);
      setPage((prevPage) => prevPage + 1);
      setTrigger(trigger + 1);
    }
  }, [inView, scrollLoading]);

  // const handleScroll = () => {
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = window.innerHeight;

  //   if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
  //     console.log(12345)
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };

  const startLiveBroadcast = async (liveId, liveTitle) => {
    try {
      await baseAxios().put(`/fleaOn/live/${liveId}/on`);
      try {
        await baseAxios().get(`/push/scrap/${liveId}?title=${liveTitle}`);
      } catch (error) {
        console.error("Failed to start live broadcast", error);
      }
      navigate(`/live/${liveId}`);
    } catch (error) {
      console.error("Failed to start live broadcast", error);
    }
  };

  const fetchShorts = async () => {
    try {
      const response = await baseAxios().get(`/fleaon/mainShorts?page=${page}`);
      console.log(response);
      const shortsData = response.data.content.map((short) => ({
        id: short.shortsId,
        productName: short.productName,
        productPrice: short.productPrice,
        tradePlace: short.tradePlace,
        dongName: short.dongName,
        length: short.length,
        isScrap: short.isScrap,
        shortsThumbnail: short.shortsThumbnail,
        shortsId: short.shortsId,
      }));
      setIsLast(response.data.last);
      setShorts((prevShorts) => [...prevShorts, ...shortsData]);
      setScrollLoading(false);
    } catch (error) {
      console.error("Error fetching shorts:", error);
      setError(error.message);
      setScrollLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      const response = await baseAxios().get(`/fleaon/mainLive?page=${page}`);
      const liveData = response.data.content.map((liveItem) => ({
        id: liveItem.liveId,
        title: liveItem.liveTitle,
        productNames: liveItem.productNames,
        productPrices: liveItem.productPrices,
        tradePlace: liveItem.tradePlace,
        dongName: liveItem.dongName,
        isLive: liveItem.isLive,
        thumbnail: liveItem.liveThumbnail,
        scrap: liveItem.scrap,
        liveDate: liveItem.liveDate,
      }));
      setIsLast(response.data.last);
      setLive((prevLive) => [...prevLive, ...liveData]);
      console.log(liveData);
      setScrollLoading(false);
    } catch (error) {
      console.error("Error fetching live data:", error);
      setError(error.message);
      setScrollLoading(false);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchShortList());
    // fetchShorts();
    // fetchLiveData();
  }, [dispatch]);

  useDidMountEffect(() => {
    if (trigger !== 0) {
      console.log("22");
      setScrollLoading(true);
      if (selectedTab === "shorts") {
        fetchShorts();
      } else {
        fetchLiveData();
      }
      setScrollLoading(false);
    }
  }, [trigger]);

  const contents = {
    live: live,
    shorts: shorts,
  };
  useDidMountEffect(() => {
    console.log("1231");
    setShorts([]);
    setLive([]);
    setPage(0);
    setTrigger(trigger + 1);
  }, [selectedTab]);

  const switchOptions = [
    { value: "live", label: "Live" },
    { value: "shorts", label: "Shorts" },
  ];

  return (
    <Container>
      <Grid container sx={{ marginTop: "12vh", marginBottom: "12vh" }}>
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
                  onClick={() => startLiveBroadcast(liveId, liveTitle)}
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
        {!isLast && <div ref={ref}>로딩</div>}
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
