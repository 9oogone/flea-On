import React from "react";
import { Box, Typography, IconButton, Grid, Paper } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ShoppingCart,
  Sell,
  SwapHoriz,
} from "@mui/icons-material";

const Calendar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: "11px 18px",
        background: "white",
        boxShadow: "0px 0px 12px rgba(13, 39, 105, 0.10)",
        borderRadius: 2,
        border: "2px solid rgba(243, 242, 241, 0.20)",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        display: "inline-flex",
      }}
    >
      <Box
        sx={{
          width: 306,
          height: 93,
          background: "white",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: 306,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 3,
            borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
            justifyContent: "space-between",
            alignItems: "flex-start",
            display: "inline-flex",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 800 }}>
            7월
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                position: "relative",
                background: "black",
              }}
            ></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>2</Typography>
            <Box
              sx={{
                width: 16,
                height: 16,
                position: "relative",
                background: "black",
              }}
            ></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>5</Typography>
            <Box
              sx={{
                width: 16,
                height: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#303030",
              }}
            ></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>3</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <ArrowBack />
            </IconButton>
            <IconButton>
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: 306,
            height: 15,
            paddingLeft: 6,
            paddingRight: 6,
            background: "white",
            justifyContent: "space-between",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <Box
              key={day}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 10 }}>{day}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            width: 306,
            height: 28,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 3,
            paddingBottom: 3,
            background: "white",
            justifyContent: "space-between",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          {["1", "2", "3", "4", "5", "6", "7"].map((date) => (
            <Box
              key={date}
              sx={{
                width: 24,
                height: 24,
                position: "relative",
                background: "black",
              }}
            >
              <Typography
                sx={{
                  width: 6,
                  height: 8,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: 10,
                }}
              >
                {date}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            width: 306,
            paddingLeft: 6,
            paddingRight: 6,
            background: "white",
            justifyContent: "space-between",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          {["21", "22", "23", "24", "25", "26", "27"].map((date) => (
            <Box
              key={date}
              sx={{
                width: 24,
                height: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  background: date === "26" ? "#FF0B55" : "white",
                  borderRadius: date === "26" ? "50%" : 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: date === "26" ? "white" : "rgba(0, 0, 0, 0.88)",
                  }}
                >
                  {date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
