import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Calendar = () => {
  const daysOfWeek = ["금", "토", "일", "월", "화", "수", "목"];
  const dates = [26, 27, 28, 29, 30, 31, 1];

  const Day = ({ day }) => (
    <Box
      sx={{
        height: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          color:
            day === "토"
              ? "rgba(5, 10, 255, 0.88)"
              : day === "일"
              ? "rgba(255, 0, 0, 0.88)"
              : "rgba(0, 0, 0, 0.88)",
          fontSize: 10,
          fontFamily: "Inter",
          fontWeight: 400,
          lineHeight: "12px",
        }}
      >
        {day}
      </Typography>
    </Box>
  );

  const DateBox = ({ date, isSelected }) => (
    <Box
      sx={{
        width: 20,
        height: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: isSelected ? "50%" : 2,
        overflow: "hidden",
        border: isSelected ? "1px solid #FF0B55" : "none",
        backgroundColor: isSelected ? "rgba(255, 11, 85, 0.03)" : "none",
      }}
    >
      <Typography
        sx={{
          color: "rgba(0, 0, 0, 0.88)",
          fontSize: 10,
          fontFamily: "Inter",
          fontWeight: 400,
          lineHeight: "22px",
        }}
      >
        {date}
      </Typography>
    </Box>
  );

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderBottom: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          height: 73,
          backgroundColor: "white",
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            alignSelf: "stretch",
            paddingBottom: 1,
            paddingLeft: 10,
            paddingRight: 10,
            borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: 38,
              height: 23,
              color: "black",
              fontSize: 12,
              fontFamily: "Inter",
              fontWeight: 700,
              lineHeight: "12px",
            }}
          >
            7월
          </Typography>
        </Box>
        <Box
          sx={{
            alignSelf: "stretch",
            height: 42,
            paddingTop: 3,
            paddingBottom: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              alignSelf: "stretch",
              paddingLeft: 12,
              paddingRight: 12,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
            }}
          >
            {daysOfWeek.map((day, index) => (
              <Day key={index} day={day} />
            ))}
          </Box>
          <Box
            sx={{
              alignSelf: "stretch",
              height: 23,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 3,
              paddingBottom: 3,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {dates.map((date, index) => (
              <DateBox key={index} date={date} isSelected={date === 28} />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Calendar;
