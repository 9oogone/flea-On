import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchLiveDetail } from "../../live/actions";
import { switchTab } from "../../../features/home/contentSlice";
import UpcomingHeader from "../../../components/UpcomingHeader";
import UpcomingFooter from "../../../components/UpcomingFooter";
import UpcomingModal from "../../../components/UpcomingModal";

const ScrapLive = ({ items }) => {
  // console.log(items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // const [modalLiveDate, setModalLiveDate] = useState("");
  // const [modalTitle, setModalTitle] = useState("");
  // const [modalProducts, setModalProducts] = useState([]);
  // const [modalThumbnail, setModalThumbnail] = useState("");
  // const [modalAuthor, setModalAuthor] = useState("");
  // const [modalTradePlace, setModalTradePlace] = useState("");

  // const handleButtonClick = (item) => {
  //   console.log("111111");

  //   dispatch(fetchLiveDetail(item.liveId));
  //   console.log("22222222222");
  //   console.log(liveDetail);

  //   setOpen(true);

  //   // setModalLiveDate(item.liveDate);
  //   // setModalTitle(item.title);
  //   // setModalProducts(item.products || []);
  //   // setModalThumbnail(item.liveThumbnail);
  //   // setModalAuthor(item.user.nickname);
  //   // setModalTradePlace(item.tradePlace);
  // };

  const handleButtonClick = async (item) => {
    try {
      await dispatch(fetchLiveDetail(item.liveId));
      setOpen(true);
    } catch (error) {
      console.error("Live detail fetch error:", error);
    }
  };
  const handleClose = () => setOpen(false);

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
              지금 라이브를 보러 갈까요?
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
              라이브 보러 가기
            </Button>
          </Grid>
        ) : (
          items.map((item, index) => (
            <Grid key={index} item xs={6} sx={{ textAlign: "center" }}>
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
                    <UpcomingHeader liveDate={item.liveDate} isScrap={true} />
                  </Box>
                  <UpcomingFooter
                    tradePlace={item.dongName}
                    title={item.title}
                  />
                </Box>
              </Button>
              <UpcomingModal
                id={index}
                open={open}
                handleClose={handleClose}

                // liveDate={modalLiveDate}
                // products={modalProducts}
                // title={modalTitle}
                // thumbnail={modalThumbnail}
                // author={modalAuthor}
                // tradePlace={modalTradePlace}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default ScrapLive;
