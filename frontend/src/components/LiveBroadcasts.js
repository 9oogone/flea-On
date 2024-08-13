import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LiveHeader from "./LiveHeader";
import UpcomingHeader from "./UpcomingHeader";
import LiveFooter from "./LiveFooter";
import UpcomingFooter from "./UpcomingFooter";
import UpcomingModal from "./UpcomingModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveDetail } from "../features/live/actions";

const LiveBroadcasts = ({ items }) => {
  console.log("LiveBroadcasts items:", items, "홈 프롭스 아이템입니다.");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liveDetail = useSelector((state) => state.live.liveDetail);
  const [open, setOpen] = useState(false);

  const handleButtonClick = (item) => {
    if (item.isLive) {
      navigate(`/live/${item.id}`);
    } else {
      console.log(item, "홈 모달클릭 아이템입니다.");

      dispatch(fetchLiveDetail(item.id));
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Grid item xs={12}>
      <Grid container>
        {items.map((item) => (
          <Grid key={item.id} item xs={6} sx={{ textAlign: "center" }}>
            <Button
              onClick={() => handleButtonClick(item)}
              sx={{ padding: 0, minWidth: 0 }}
            >
              <Box
                sx={{
                  width: "16vh",
                  height: "28vh",
                  backgroundImage: `url(https://i11b202.p.ssafy.io/openvidu/${item.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  boxShadow: "0px -40px 20px rgba(0, 0, 0, 0.25) inset",
                  mb: 2,
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "85%",
                  }}
                >
                  {item.isLive ? (
                    <LiveHeader />
                  ) : (
                    <UpcomingHeader
                      id={item.id}
                      liveDate={liveDetail.liveDate} ////item에 날짜 없음....
                    />
                  )}
                </Box>
                {item.isLive ? (
                  <LiveFooter ///궁금한점 라이브 방송하고 있는 시점의 물건을 띄워야하는데,,,,?
                    name={item.name}
                    tradePlace={item.tradePlace}
                    title={item.title}
                    price={item.price}
                  />
                ) : (
                  <UpcomingFooter
                    tradePlace={item.tradePlace} ///동이름 없음.,,,
                    title={item.title}
                  />
                )}
              </Box>
            </Button>
            {liveDetail.liveId && (
              <UpcomingModal
                id={item.id}
                open={open}
                handleClose={handleClose}
                liveDetail={liveDetail}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LiveBroadcasts;
