import React, { useState } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import UpcomingModal from "./UpcomingModal"; // 모달 컴포넌트 임포트

const UpcomingBroadcasts = ({ items }) => {
  const [open, setOpen] = useState(false);
  const [modalLiveDate, setModalLiveDate] = useState("");

  const handleOpen = (liveDate) => {
    setModalLiveDate(liveDate);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Container sx={{ margin: "8px" }}>
      <Typography variant="h5" gutterBottom>
        방송예정상품
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          whiteSpace: "nowrap",
          padding: "10px 0",
        }}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleOpen(item.live_date)}
            sx={{
              padding: 0,
              margin: 0,
              minWidth: 0,
              textTransform: "none",
              width: 160,
              height: 80,
              background:
                "linear-gradient(100deg, rgba(255, 87, 87, 0.18) 50%, rgba(255, 11, 85, 0.18) 100%)",
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexShrink: 0,
              mr: 3,
            }}
          >
            <Typography
              sx={{
                color: "#FF0B55",
              }}
            >
              {item.live_date}
            </Typography>
            <Typography
              sx={{
                maxWidth: "40px",
                fontSize: 10,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </Typography>
            <Typography
              sx={{
                fontWeight: 300,
              }}
            >
              {item.price}원
            </Typography>
          </Button>
        ))}
      </Box>
      <UpcomingModal
        open={open}
        handleClose={handleClose}
        liveDate={modalLiveDate}
      />
    </Container>
  );
};

export default UpcomingBroadcasts;
