import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import UpcomingHeader from "../../../components/UpcomingHeader";
import UpcomingFooter from "../../../components/UpcomingFooter";
import UpcomingModal from "../../../components/UpcomingModal";

const Lives = ({ items }) => {
  const [open, setOpen] = useState(false);
  const [modalLiveDate, setModalLiveDate] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalProducts, setModalProducts] = useState([]);
  const [modalThumbnail, setModalThumbnail] = useState("");
  const [modalAuthor, setModalAuthor] = useState("");
  const [modalTradePlace, setModalTradePlace] = useState("");

  const handleButtonClick = (item) => {
    setModalLiveDate(item.live_date);
    setModalTitle(item.title);
    setModalProducts(item.products || []);
    setModalThumbnail(item.thumbnail);
    setModalAuthor(item.author);
    setModalTradePlace(item.trade_place);
    setOpen(true);
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
            <UpcomingModal
              open={open}
              handleClose={handleClose}
              liveDate={modalLiveDate}
              products={modalProducts}
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

export default Lives;
