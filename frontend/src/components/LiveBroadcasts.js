import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 최신 버전 React Router 사용
import LiveHeader from "./LiveHeader";
import UpcomingHeader from "./UpcomingHeader";
import LiveFooter from "./LiveFooter";
import UpcomingFooter from "./UpcomingFooter";
import UpcomingModal from "./UpcomingModal";

const LiveBroadcasts = ({ items }) => {
  const navigate = useNavigate(); // navigate 함수 생성
  const [open, setOpen] = useState(false);
  const [modalLiveDate, setModalLiveDate] = useState("");
  const [modalProducts, setModalProducts] = useState([]);

  const handleButtonClick = (item) => {
    if (item.is_live) {
      navigate(`/live/${item.id}`);
    } else {
      console.log(item.products);
      setModalLiveDate(item.live_date);
      setModalProducts(item.products || []); // products가 없으면 빈 배열로 설정
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
                  backgroundImage: `url(${item.thumbnail})`,
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
                  {item.is_live ? (
                    <LiveHeader />
                  ) : (
                    <UpcomingHeader
                      liveDate={item.live_date}
                      isScrap={item.is_scrap}
                    />
                  )}
                </Box>
                {item.is_live ? (
                  <LiveFooter
                    name={item.name}
                    tradePlace={item.trade_place}
                    title={item.title}
                    price={item.price}
                  />
                ) : (
                  <UpcomingFooter
                    tradePlace={item.trade_place}
                    title={item.title}
                  />
                )}
              </Box>
            </Button>
            <UpcomingModal
              open={open}
              handleClose={handleClose}
              liveDate={modalLiveDate}
              products={modalProducts} // 상태에서 설정된 products 사용
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LiveBroadcasts;
