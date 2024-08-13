import React, { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LiveHeader from "./LiveHeader";
import UpcomingHeader from "./UpcomingHeader";
import LiveFooter from "./LiveFooter";
import UpcomingFooter from "./UpcomingFooter";
import UpcomingModal from "./UpcomingModal";
import baseAxios from "../utils/httpCommons";

const LiveBroadcasts = ({ items: initialItems }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalLiveDate, setModalLiveDate] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalProductNames, setModalProductNames] = useState([]);
  const [modalProductPrices, setModalProductPrices] = useState([]);
  const [modalThumbnail, setModalThumbnail] = useState("");
  const [modalAuthor, setModalAuthor] = useState("");
  const [modalTradePlace, setModalTradePlace] = useState("");
  const [modalScrap, setModalScrap] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const handleButtonClick = (item) => {
    if (item.isLive) {
      navigate(`/live/${item.id}`);
    } else {
      setModalLiveDate(item.liveDate);
      setModalTitle(item.title);
      setModalProductNames(item.productNames || []);
      setModalProductPrices(item.productPrices || []);
      setModalThumbnail(item.thumbnail);
      setModalAuthor(item.author);
      setModalTradePlace(item.tradePlace);
      setModalScrap(item.scrap);
      setOpen(true);
    }
  };

  const handleScrapToggle = async (id, currentScrap) => {
    try {
      if (currentScrap) {
        await baseAxios().delete(`/fleaon/users/liveScrap?liveId=${id}`);
      } else {
        await baseAxios().post(`/fleaon/users/liveScrap?liveId=${id}`);
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, scrap: !currentScrap } : item
        )
      );
    } catch (error) {
      console.error("Error toggling scrap:", error);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Grid item xs={12}>
      <Grid container>
        {items && items.length > 0 ? (
          items.map((item) => (
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
                    {item.isLive ? (
                      <LiveHeader />
                    ) : (
                      <UpcomingHeader
                        id={item.id}
                        liveDate={item.liveDate}
                        scrap={item.scrap}
                        setScrap={() => handleScrapToggle(item.id, item.scrap)}
                      />
                    )}
                  </Box>
                  {item.isLive ? (
                    <LiveFooter
                      name={item.productNames}
                      tradePlace={item.tradePlace}
                      title={item.title}
                      price={item.productPrices}
                    />
                  ) : (
                    <UpcomingFooter
                      tradePlace={item.tradePlace}
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
                scrap={modalScrap}
                setScrap={() => handleScrapToggle(item.id, modalScrap)}
              />
            </Grid>
          ))
        ) : (
          <Box>No live broadcasts available.</Box>
        )}
      </Grid>
    </Grid>
  );
};

export default LiveBroadcasts;
