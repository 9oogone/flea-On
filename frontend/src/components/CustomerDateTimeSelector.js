import React, { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, Grid } from "@mui/material";
import { format, addDays, isToday, isPast, parseISO, isValid } from "date-fns";
import { PlaceOutlined } from "@mui/icons-material";
import baseAxios from "../utils/httpCommons"; // baseAxios import

const CustomerDateTimeSelector = ({
  open,
  handleClose,
  place,
  liveDate,
  times,
  selectedProductId,
  user,
  seller,
  liveId,
}) => {
  const [selectedDate, setSelectedDate] = useState(liveDate);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false); // 버튼 가시성 상태 추가

  useEffect(() => {
    if (times.length > 0) {
      setSelectedDate(times[0].date);
    }
  }, [times]);

  const weekdayMap = {
    Sunday: "일",
    Monday: "화",
    Tuesday: "화",
    Wednesday: "수",
    Thursday: "목",
    Friday: "금",
    Saturday: "토",
  };

  const generateWeekDates = () => {
    const dates = [];
    if (!liveDate) {
      console.error("liveDate is undefined");
      return dates;
    }

    const parsedLiveDate = parseISO(liveDate);
    if (!isValid(parsedLiveDate)) {
      console.error("Invalid liveDate:", liveDate);
      return dates;
    }

    for (let i = 0; i < 7; i++) {
      const day = addDays(parsedLiveDate, i);

      if (!isValid(day)) {
        console.error("Invalid date generated:", day);
        continue;
      }

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
          borderWidth: "2px",
          borderStyle: "solid",
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
    setIsButtonVisible(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setIsButtonVisible(true);
  };
  const handleConfirm = async () => {
    console.log("user : ", {
      buyerId: user.userId,
      sellerId: seller.userId,
      productId: Number(selectedProductId),
      liveId: Number(liveId),
      tradePlace: place,
      tradeTime: `${selectedTime}:00`,
      tradeDate: selectedDate,
    });
    try {
      const response = await baseAxios().post(
        "/fleaon/purchase/confirmPurchase",
        {
          buyerId: user.userId,
          sellerId: seller.userId,
          productId: Number(selectedProductId),
          liveId: Number(liveId),
          tradePlace: place,
          tradeTime: `${selectedTime}:00`,
          tradeDate: selectedDate,
        }
      );

      if (response.status === 200) {
        // 요청 성공 시 처리
        const data = {
          chattingId: response.data,
          contents: `[System Message]<br/>
          안녕하세요 ${user.nickname}님!<br/>
        ${seller.nickname}의 마켓에 오신 것을 환영해요.<br/><br/>
          ✨ 거래 안내 <br/>
          거래 시간 :  ${selectedDate} ${selectedTime}<br/>
          거래 장소 :  ${place}<br/>
          거래 예정입니다!<br/>
          늦지 않게 약속된 장소에서 만나요~`,
          bot: true,
        };
        console.log("chatting Id : ", response.data);
        console.log(
          "contents : ",
          `[System Message]<br/>
          안녕하세요 ${user.nickname}님!<br/>
        ${seller.nickname}의 마켓에 오신 것을 환영해요.<br/><br/>
          ✨ 거래 안내 <br/>
          거래 시간 :  ${selectedDate} ${selectedTime}<br/>
          거래 장소 :  ${place}<br/>
          거래 예정입니다!<br/>
          늦지 않게 약속된 장소에서 만나요~`
        );
        await baseAxios().post("/fleaon/chat/messagesFromSeller", data);
        handleClose();
        console.log(response);
        console.log({
          buyerId: user.userId,
          sellerId: seller.userId,
          productId: Number(selectedProductId),
          liveId: Number(liveId),
          tradePlace: place,
          tradeTime: `${selectedTime}:00`,
          tradeDate: selectedDate,
        });
      } else {
        // 요청 실패 시 처리
        console.error("Purchase confirmation failed:", response);
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
    }
  };

  const formatTime = (time) => {
    const parsedTime = parseISO(`1970-01-01T${time}`);

    if (!isValid(parsedTime)) {
      console.error("Invalid time parsed:", time);
      return { period: "", formattedTime: "" };
    }

    const isPM = format(parsedTime, "a") === "PM";
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const period = isPM ? "오후" : "오전";

    const formattedMinutes = minutes === 0 ? "00" : `${minutes}`;

    return { period, formattedTime: `${formattedHours}:${formattedMinutes}` };
  };

  const currentMonth = selectedDate
    ? format(parseISO(selectedDate), "M월")
    : "";
  const filteredTimes = times?.filter((slot) => slot.date === selectedDate);
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
                              borderWidth: "2px",
                              borderStyle: "solid",
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
                              borderWidth: "2px",
                              borderStyle: "solid",
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

          {isButtonVisible && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConfirm}
              sx={{ mt: 3 }}
              fullWidth
            >
              구매 확정
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerDateTimeSelector;
