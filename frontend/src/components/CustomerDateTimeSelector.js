import React, { useState } from "react";
import { Box, Typography, Modal, Button, Grid } from "@mui/material";
import { format, addDays, isToday, isPast, parse } from "date-fns";
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

  // 요일 박스
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
          fontSize: 12,
        }}
      >
        {day}
      </Typography>
    </Box>
  );

  // 날짜 박스
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
        backgroundColor: isSelected ? "rgba(255, 11, 85, 0.03)" : "transparent",
        borderColor: isSelected ? "#FF0B55" : "transparent",
        ...(isSelected && {
          borderWidth: "2px", // 선택되었을 때의 테두리 두께
          borderStyle: "solid", // 선택되었을 때의 테두리 스타일
        }),
      }}
    >
      <Typography
        sx={{
          color: "rgba(0, 0, 0, 0.88)",
          fontSize: 12,
        }}
      >
        {date}
      </Typography>
    </Box>
  );

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const formatTime = (time) => {
    const parsedTime = parse(time, "HH:mm", new Date());
    const isPM = format(parsedTime, "a") === "PM";
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const period = isPM ? "오후" : "오전";

    const formattedMinutes = minutes === 0 ? "00" : `${minutes}`;

    return { period, formattedTime: `${formattedHours}:${formattedMinutes}` };
  };

  const currentMonth = format(new Date(selectedDate), "M월");
  const filteredTimes = times.filter((slot) => slot.date === selectedDate);
  const morningSlots = filteredTimes.filter(
    (slot) => formatTime(slot.time).period === "오전"
  );
  const afternoonSlots = filteredTimes.filter(
    (slot) => formatTime(slot.time).period === "오후"
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: "100%",
          height: 400,
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Box sx={{ mx: 2 }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              mt: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              날짜와 시간을 선택해주세요
            </Typography>
            <Box sx={{ display: "flex", mt: 1, alignItems: "center" }}>
              <PlaceOutlined />
              <Typography sx={{ pl: 0.5, fontWeight: 700 }}>{place}</Typography>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  py: 1,
                  pl: 1,
                }}
              >
                {currentMonth}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
                pt: 1,
                pb: 0.5,
                px: 1,
              }}
            >
              {weekDates.map((dateInfo, index) => (
                <Box
                  key={index}
                  onClick={() => handleDateSelect(dateInfo.date)}
                >
                  <Box
                    sx={{
                      alignSelf: "stretch",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 1,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <Day day={dateInfo.weekday} />
                    <DateBox
                      date={dateInfo.day}
                      isSelected={selectedDate === dateInfo.date}
                      sx={{
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 2, width: "100%", maxHeight: 200, overflowY: "auto" }}>
            {morningSlots.length > 0 && (
              <Box sx={{ mb: 2, px: 1 }}>
                <Box sx={{ pb: 1 }}>
                  <Typography sx={{ fontSize: 12 }}>오전</Typography>
                </Box>

                <Grid container spacing={1}>
                  {morningSlots.map((slot, index) => {
                    const { formattedTime } = formatTime(slot.time);
                    const isSelected = selectedTime === slot.time;
                    return (
                      <Grid
                        item
                        xs={3}
                        key={index}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          onClick={() => handleTimeSelect(slot.time)}
                          sx={{
                            width: "100%",
                            border: "1px solid rgba(0, 0, 0, 0.20)",
                            borderRadius: 2,
                            ...(isSelected && {
                              border: "1px solid #FF0B55",
                              borderColor: "#FF0B55",
                              borderWidth: "2px", // 선택되었을 때의 테두리 두께
                              borderStyle: "solid", // 선택되었을 때의 테두리 스타일
                            }),
                          }}
                        >
                          {formattedTime}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
            {afternoonSlots.length > 0 && (
              <Box sx={{ mb: 2, px: 1 }}>
                <Box sx={{ pb: 1 }}>
                  <Typography sx={{ fontSize: 12 }}>오후</Typography>
                </Box>
                <Grid container spacing={1}>
                  {afternoonSlots.map((slot, index) => {
                    const { formattedTime } = formatTime(slot.time);
                    const isSelected = selectedTime === slot.time;
                    return (
                      <Grid
                        item
                        xs={3}
                        key={index}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          onClick={() => handleTimeSelect(slot.time)}
                          sx={{
                            width: "100%",
                            border: "1px solid rgba(0, 0, 0, 0.20)",
                            borderRadius: 2,
                            ...(isSelected && {
                              border: "1px solid #FF0B55",
                              borderColor: "#FF0B55",
                              borderWidth: "2px", // 선택되었을 때의 테두리 두께
                              borderStyle: "solid", // 선택되었을 때의 테두리 스타일
                            }),
                          }}
                        >
                          {formattedTime}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
            {morningSlots.length === 0 && afternoonSlots.length === 0 && (
              <Typography
                variant="subtitle1"
                sx={{ textAlign: "center", mt: 2 }}
              >
                선택한 날짜에는 거래 가능한 시간이 없어요
                <br />
                다른 날짜를 선택해 주세요.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerDateTimeSelector;
