import React from "react";
import { Box, Typography } from "@mui/material";
import { ShoppingCart, Sell, PlaceOutlined } from "@mui/icons-material";
import { formatTime, formatPrice } from "../../../utils/cssUtils";

const CalendarTrade = ({ userId, selectedDate, trades }) => {
  if (!selectedDate || Object.keys(trades).length === 0) {
    return null; // 아무것도 렌더링하지 않음
  }
  console.log(trades);

  return (
    // <Box>얍</Box>
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {Object.entries(trades).map(([location, dailytrades]) => (
        <Box
          key={location}
          sx={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            pt: 2,
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              pb: 1,
            }}
          >
            <PlaceOutlined />
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.90)",
                fontSize: 16,
                fontFamily: "Noto Sans",
                fontWeight: "900",
                lineHeight: "22.40px",
              }}
            >
              {location}
            </Typography>
          </Box>

          <Box
            sx={{
              alignSelf: "stretch",
              pt: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {dailytrades.map((trade, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: "stretch",
                  px: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  {trade.buyer_id === userId ? (
                    <ShoppingCart />
                  ) : trade.seller_id === userId ? (
                    <Sell />
                  ) : null}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                      }}
                    >
                      {trade.place}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 10,
                        fontFamily: "Noto Sans",
                        fontWeight: "400",
                      }}
                    >
                      {trade.product} · {formatPrice(trade.price)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "rgba(0, 0, 0, 0.90)",
                      fontSize: 14,
                      fontFamily: "Noto Sans",
                      fontWeight: "400",
                    }}
                  >
                    {formatTime(trade.time)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CalendarTrade;
