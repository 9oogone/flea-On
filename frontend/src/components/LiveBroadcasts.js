import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LiveHeader from "./LiveHeader";
import UpcomingHeader from "./UpcomingHeader";
import LiveFooter from "./LiveFooter";
import UpcomingFooter from "./UpcomingFooter";
import UpcomingModal from "./UpcomingModal";

const LiveBroadcasts = ({ items }) => {
  console.log("LiveBroadcasts items:", items);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalLiveDate, setModalLiveDate] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalProductNames, setModalProductNames] = useState([]);
  const [modalProductPrices, setModalProductPrices] = useState([]);
  const [modalThumbnail, setModalThumbnail] = useState("");
  const [modalAuthor, setModalAuthor] = useState("");
  const [modalTradePlace, setModalTradePlace] = useState("");

  const handleButtonClick = (item) => {
    if (item.is_live) {
      navigate(`/live/${item.id}`);
    } else {
      console.log(item);
      setModalLiveDate(item.live_date);
      setModalTitle(item.title);
      setModalProductNames(item.productNames || []);
      setModalProductPrices(item.productPrices || []);
      setModalThumbnail(item.thumbnail);
      setModalAuthor(item.author);
      setModalTradePlace(item.trade_place);
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
                  {item.is_live ? (
                    <LiveHeader />
                  ) : (
                    <UpcomingHeader id={item.id} liveDate={item.live_date} />
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
              id={item.id}
              open={open}
              handleClose={handleClose}
              liveDate={modalLiveDate}
              productNames={modalProductNames}
              productPrices={modalProductPrices}
              title={modalTitle}
              thumbnail={modalThumbnail}
              author={modalAuthor}
              tradePlace={modalTradePlace}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LiveBroadcasts;
