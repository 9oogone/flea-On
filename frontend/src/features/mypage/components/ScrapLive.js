import React, { useState } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import UpcomingHeader from "../../../components/UpcomingHeader";
import UpcomingFooter from "../../../components/UpcomingFooter";
import UpcomingModal from "../../../components/UpcomingModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { switchTab } from "../../../features/home/contentSlice";

const ScrapLive = ({ items }) => {
  // console.log(items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [open, setOpen] = useState(false);
  // const [modalLiveDate, setModalLiveDate] = useState("");
  // const [modalTitle, setModalTitle] = useState("");
  // const [modalProducts, setModalProducts] = useState([]);
  // const [modalThumbnail, setModalThumbnail] = useState("");
  // const [modalAuthor, setModalAuthor] = useState("");
  // const [modalTradePlace, setModalTradePlace] = useState("");

  // const handleButtonClick = (item) => {
  //   setModalLiveDate(item.live_date);
  //   setModalTitle(item.title);
  //   setModalProducts(item.products || []);
  //   setModalThumbnail(item.thumbnail);
  //   setModalAuthor(item.author);
  //   setModalTradePlace(item.trade_place);
  //   setOpen(true);
  // };

  // const handleClose = () => setOpen(false);

  const handleNavigateToLive = () => {
    dispatch(switchTab("live"));
    navigate("/");
  };
  return (
    <Grid item xs={12}>
      <Grid container>
        {items.length === 0 ? (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" sx={{ color: "grey.700" }}>
              관심있는 라이브가 없어요. <br />
              지금 라이브를 보러 가세용
            </Typography>
            <Button
              onClick={handleNavigateToLive}
              sx={{
                mt: 2,
                color: "white",
                backgroundColor: "#FF0B55",
                padding: "10px 20px",
                borderRadius: 3,
                textTransform: "none",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              라이브보러가기
            </Button>
          </Grid>
        ) : (
          items.map((item) => (
            <Grid key={item.live_id} item xs={6} sx={{ textAlign: "center" }}>
              <Button
                // onClick={() => handleButtonClick(item)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: "16vh",
                    height: "28vh",
                    backgroundImage: `url(${item.live_thumbnail})`,
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
                    <UpcomingHeader
                      liveDate={item.live_date}
                      isScrap={item.is_scrap}
                    />
                  </Box>
                  <UpcomingFooter
                    tradePlace={item.trade_place}
                    title={item.title}
                  />
                </Box>
              </Button>
              {/* <UpcomingModal
                id={item.id}
                open={open}
                handleClose={handleClose}
                liveDate={modalLiveDate}
                products={modalProducts}
                title={modalTitle}
                thumbnail={modalThumbnail}
                author={modalAuthor}
                tradePlace={modalTradePlace}
              /> */}
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default ScrapLive;
