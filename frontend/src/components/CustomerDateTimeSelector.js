import React, { useState } from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import { format, addDays, isToday, isPast } from "date-fns";
import { PlaceOutlined } from "@mui/icons-material";

const CustomerDateTimeSelector = ({
  open,
  handleClose,
  place,
  live_date,
  times = [],
}) => {
  const [selectedDate, setSelectedDate] = useState(live_date);
  const [selectedTime, setSelectedTime] = useState(null);

  const weekdayMap = {
    Sunday: "일",
    Monday: "월",
    Tuesday: "화",
    Wednesday: "수",
    Thursday: "목",
    Friday: "금",
    Saturday: "토",
  };

  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(new Date(live_date), i);
      const weekday = format(day, "eeee");
      dates.push({
        date: format(day, "yyyy-MM-dd"),
        day: format(day, "d"),
        weekday: weekdayMap[weekday],
        isToday: isToday(day),
        isPast: isPast(day),
      });
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // 시간 선택 초기화
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const currentMonth = format(new Date(selectedDate), "M월");
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          // transform: "translateX(-50%) translateY(100%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          height: 400,
          overflowY: "auto",
          // transition: "transform 0.5s ease-in-out", // 부드러운 애니메이션
          // "&.MuiModal-open": {
          //   transform: "translateX(-50%) translateY(0)", // 열릴 때 위로 이동
          // },
        }}
      >
        <Typography variant="h6" component="h2">
          날짜와 시간을 선택해주세요
        </Typography>
        <Box sx={{ display: "flex", mt: 1, alignItems: "center" }}>
          <PlaceOutlined />
          <Typography sx={{ pl: 0.5 }}>{place}</Typography>
        </Box>
        <Box
          sx={{
            alignSelf: "stretch",
            borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontFamily: "Inter",
              fontWeight: 700,
            }}
          >
            {currentMonth}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {weekDates.map((dateInfo, index) => (
            <Box>
              <Box key={index} onClick={() => handleDateSelect(dateInfo.date)}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      color:
                        dateInfo.weekday === "토"
                          ? "blue"
                          : dateInfo.weekday === "일"
                          ? "red"
                          : "default",
                    }}
                  >
                    {dateInfo.weekday}
                  </Typography>
                  <Button
                    variant={
                      selectedDate === dateInfo.date ? "contained" : "outlined"
                    }
                    sx={{
                      borderColor:
                        selectedDate === dateInfo.date
                          ? "#FF0B55"
                          : "transparent",
                      borderRadius: "50%",
                      minWidth: 0,
                      width: "2rem",
                      height: "2rem",
                      padding: 0,
                      justifyContent: "center",
                      backgroundColor:
                        selectedDate === dateInfo.date
                          ? "#FF0B55"
                          : "transparent",
                    }}
                  >
                    <Typography>{dateInfo.day}</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)", // 한 줄에 4개의 열을 설정
              gap: 1, // 버튼 사이의 간격
            }}
          >
            {times
              .filter((slot) => slot.date === selectedDate)
              .map((slot, index) => (
                <Button
                  key={index}
                  variant={
                    selectedTime === slot.time ? "contained" : "outlined"
                  }
                  onClick={() => handleTimeSelect(slot.time)}
                  sx={{
                    borderColor:
                      selectedTime === slot.time ? "#FF0B55" : "default",
                    color: selectedTime === slot.time ? "#FF0B55" : "default",
                    backgroundColor:
                      selectedTime === slot.time ? "#FF0B55" : "transparent",
                  }}
                >
                  {slot.time}
                </Button>
              ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerDateTimeSelector;
