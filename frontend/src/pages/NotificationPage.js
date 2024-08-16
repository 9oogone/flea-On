import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import baseAxios from "../utils/httpCommons";
import { useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getRelativeDate } from "../utils/cssUtils";
import CustomerDateTimeSelector from "../components/CustomerDateTimeSelector";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Notification = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState({});
  const [place, setPlace] = useState("");
  const [times, setTimes] = useState([]);
  const [liveDate, setLiveDate] = useState("");
  const [liveId, setLiveId] = useState(0);
  const [product, setProduct] = useState({});
  const [productId, setProductId] = useState(0);
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleCustomerClick = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChildClose = () => setChildOpen(false);
  const handleChildOpen = () => setChildOpen(true);

  const fetchAlarm = () => {
    baseAxios()
      .get(`/fleaon/alarms/`)
      .then((res) => {
        console.log(res);
        setAlarms(res.data);
        toReadAlarm();
      });
  };
  const toReadAlarm = () => {
    baseAxios().put("/fleaon/alarms/read");
  };
  useEffect(() => {
    fetchAlarm();
  }, []);
  const generateTimeSlots = (tradeTimes) => {
    const slots = [];
    tradeTimes.forEach((time) => {
      try {
        let start = new Date(`${time.date}T${time.tradeStart}`);
        const end = new Date(`${time.date}T${time.tradeEnd}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date format");
        }
        const adjustToHalfHour = (date) => {
          const minutes = date.getMinutes();
          const adjustedMinutes = minutes < 30 ? 0 : 30;
          date.setMinutes(adjustedMinutes, 0, 0);
        };
        adjustToHalfHour(start);
        while (start <= end) {
          slots.push({
            time: start.toTimeString().slice(0, 5),
            date: time.date,
          });
          start = new Date(start.getTime() + 30 * 60000);
        }
      } catch (error) {
        console.error("Invalid time value:", time);
      }
    });
    return slots;
  };
  const fetchProductList = async (id) => {
    try {
      const response = await baseAxios().get(`/fleaOn/live/${id}/detail`);
      const {
        title,
        tradePlace,
        liveDate: live_date,
        liveTradeTimes,
        products,
        user,
      } = response.data;
      for (let index = 0; index < products.length; index++) {
        const p = products[index];
        if (p.productId === productId) {
          setProduct(p);
        }
      }
      setTitle(title);
      setSeller(user);
      setLiveId(id);

      setPlace(tradePlace);
      setLiveDate(live_date);
      const timeSlots = generateTimeSlots(liveTradeTimes);
      setTimes(timeSlots);
    } catch (error) {
      console.error("상품 목록 가져오기 오류:", error);
    }
  };
  const handleTradeCancel = async (id) => {
    //구매취소 로직
    await baseAxios().delete(`/fleaon/purchase/cancel`, {
      data: {
        productId: id,
        userId: user.userId,
      },
    });
    await baseAxios().post("/push/cancelAlarm", { productIds: [id] });
  };
  const handleBackButtonClick = () => {
    navigate("/");
  };
  const handleAlarmClick = (alarm) => {
    if (alarm.type === 1) {
      //구매 취소
      setProductId(alarm.productId);
      fetchProductList(alarm.liveId);
      handleCustomerClick();
    } else if (alarm.type === 2) {
      //스크랩 방송 알림
      navigate("/live/" + alarm.liveId);
    } else if (alarm.type === 3) {
      //내 상품 팔림 알림
      navigate("/mypage");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "rgba(0, 0, 0, 0.03)" }}>
      <Box sx={{ mb: 7 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: "100%",
            pt: 2,
            pb: 3,
            left: 0,
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          <Box
            onClick={handleBackButtonClick}
            sx={{
              cursor: "pointer",
              position: "absolute",
              left: 24,
            }}
          >
            <ArrowBackIosNewIcon />
          </Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            알림
          </Typography>
        </Box>

        <Box
          sx={{
            pt: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {alarms.map((alarm, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                mb: 2,
                background: alarm.read
                  ? "#fff"
                  : "linear-gradient(100deg, rgba(255, 87, 87, 0.18) 50%, rgba(255, 11, 85, 0.18) 100%)",
                border: alarm.read ? "2px solid #fff" : "0px",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                width: "80%",
                zIndex: 1,
              }}
              onClick={() => handleAlarmClick(alarm)}
            >
              <Avatar
                alt="Profile Image"
                src={alarm.profilePic}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                {alarm.read}
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {alarm.content}
                </Typography>
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "rgba(128, 128, 128, 0.55)",
                    fontSize: 11,
                    wordWrap: "break-word",
                  }}
                >
                  {getRelativeDate(alarm.date)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 거래 확정 다이얼로그 */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#333",
          }}
        >
          줄 서기 구매!
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#555",
            }}
          >
            당신에게 구매의 기회가 왔습니다.
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#FF0B55",
              backgroundColor: "#fbe9e7",
              padding: "8px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {title} {product.price}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#777",
            }}
          >
            거래 장소 : {place}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#777",
            }}
          >
            해당 상품을 구매하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Button
            onClick={handleTradeCancel}
            variant="outlined"
            color="secondary"
            sx={{
              color: "#333",
              borderColor: "#ccc",
              borderRadius: "8px",

              width: "100px",
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleChildOpen}
            color="primary"
            variant="contained"
            sx={{
              width: "100px",
              backgroundColor: "#FF0B55",
              color: "white",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          >
            구매하기
          </Button>
        </DialogActions>
      </Dialog>
      <CustomerDateTimeSelector
        open={childOpen}
        handleClose={handleChildClose}
        place={place}
        liveDate={liveDate}
        times={times}
        selectedProductId={productId}
        user={user}
        seller={seller}
        liveId={liveId}
      />
    </Box>
  );
};

export default Notification;
