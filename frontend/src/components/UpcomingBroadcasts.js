import React from "react";
import { Box, Typography, Container } from "@mui/material";

const UpcomingBroadcasts = ({ items }) => {
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
          <Box
            sx={{
              width: 144,
              height: 64,
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
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default UpcomingBroadcasts;
