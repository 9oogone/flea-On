import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { confirmTrade, fetchCalendarWeek, fetchCalendarDate } from "../actions";
import { useNavigate } from "react-router-dom";
import { fetchChats } from "../../chat/chatSlice";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  Sell,
  PlaceOutlined,
  PlaceRounded,
  ChevronRight,
} from "@mui/icons-material";
import { startOfWeek } from "date-fns";
import { formatTime, formatPrice } from "../../../utils/cssUtils";
import { updateUserLevel } from "../../auth/authSlice";

const CalendarTrade = ({ userId, selectedDate, dateTrade }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [trade, setTrade] = useState([]);
  const [tradeDone, setTradeDone] = useState([]);
  const { chats, status } = useSelector((state) => state.chat);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  // console.log(selectedDate, "일별 거래 날짜 입니다.");

  useEffect(() => {
    setTrade(dateTrade?.dayTradeResponses || []);
    setTradeDone(dateTrade?.tradeDoneSchedules || []);
  }, [dateTrade]);

  // 채팅하기
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChats());
    }
    // console.log(chats);
  }, [status, dispatch]);
  // console.log(chats, status, "챗 디스패치입니다");

  const goToChatRoom = (chats, chattingId) => {
    const chat = chats.find((chat) => chat.chattingId === chattingId);

    if (chat) {
      // 채팅 객체가 존재하면 해당 채팅방으로 이동
      navigate(`/chat/${chat.chattingId}`, { state: chat });
    } else {
      // 채팅 객체가 존재하지 않으면 에러 핸들링 (선택적)
      setSnackbarMessage("채팅방이 생성되지 않았어요.");
      setOpenSnackbar(true);
    }
  };

  // 판매자 구매확정 모달 열기
  const handleTradeDone = (trade) => {
    // console.log(trade, "거래확정 클릭시 나오는 거래입니다.");
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrade(null);
  };

  const handleConfirmTrade = () => {
    if (selectedTrade) {
      const tradeData = {
        buyerId: selectedTrade.buyerId,
        sellerId: selectedTrade.sellerId,
        productId: selectedTrade.productId,
        liveId: selectedTrade.liveId,
        tradePlace: selectedTrade.tradePlace,
        tradeTime: selectedTrade.tradeTime,
        tradeDate: selectedDate,
      };

      dispatch(confirmTrade(tradeData))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          setSelectedTrade(null);

          // 상태 업데이트를 위한 액션 디스패치
          dispatch(
            fetchCalendarWeek({
              email: user?.email,
              today: startOfWeek(selectedDate, { weekStartsOn: 0 }),
            })
          );

          dispatch(
            fetchCalendarDate({ email: user?.email, tradeDate: selectedDate })
          );
          const newLevel = user?.level + 1;
          dispatch(updateUserLevel(newLevel));
        })
        .catch((error) => {
          console.error("거래 확정 중 오류 발생:", error);
          // 에러 처리
        });
    }
  };

  // 판매자 채팅하기
  const handleChat = () => {
    if (selectedTrade) {
      // console.log(chats);
      // console.log(selectedTrade);
      goToChatRoom(chats, selectedTrade.chattingId);
    }
  };

  // 동 이름을 기준으로 trade 배열을 그룹화
  const groupedTrades = trade.reduce((acc, curr) => {
    const { dongName } = curr;
    if (!acc[dongName]) {
      acc[dongName] = [];
    }
    acc[dongName].push(curr);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {Object.keys(groupedTrades).length > 0 &&
        Object.entries(groupedTrades).map(([dongName, trades]) => (
          <Box
            key={dongName}
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
                  fontFamily: "Noto Sans KR",
                  fontWeight: "900",
                  lineHeight: "22.40px",
                }}
              >
                {dongName}
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
              {trades.map((trade, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf: "stretch",
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {trade.buyerId === userId ? (
                      <ShoppingCart />
                    ) : trade.sellerId === userId ? (
                      <Sell />
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "rgba(0, 0, 0, 0.90)",
                          fontSize: 14,
                          fontFamily: "Noto Sans KR",
                          fontWeight: "400",
                        }}
                      >
                        {trade.tradePlace}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(0, 0, 0, 0.90)",
                          fontSize: 10,
                          fontFamily: "Noto Sans KR",
                          fontWeight: "400",
                        }}
                      >
                        {trade.productName} · {formatPrice(trade.price)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "40%",

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          color: "rgba(0, 0, 0, 0.90)",
                          fontSize: 14,
                          fontFamily: "Noto Sans KR",
                          fontWeight: "400",
                        }}
                      >
                        {formatTime(trade.tradeTime)}
                      </Typography>
                      {trade.buyerId === userId ? (
                        <Box
                          sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: 12,
                              letterSpacing: "0.1px",
                            }}
                            onClick={() =>
                              goToChatRoom(chats, trade.chattingId)
                            }
                          >
                            채팅하기
                          </Typography>
                          <ChevronRight />
                        </Box>
                      ) : trade.sellerId === userId ? (
                        <Box
                          sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                            display: "flex",
                          }}
                          onClick={() => handleTradeDone(trade)}
                        >
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: 12,
                              letterSpacing: "0.1px",
                            }}
                          >
                            거래확정
                          </Typography>
                          <ChevronRight />
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

      {/* 거래 확정 다이얼로그 */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}
      >
        <DialogTitle
          sx={{
            color: "#FF0B55",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          거래 확정
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            거래를 확정하시겠습니까?
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888" }}>
            (거래를 확정 시 판매한 상품의 쇼츠와 <br />
            생성된 채팅방이 사라집니다.)
          </Typography>
          <Box
            onClick={handleChat}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#FF0B55" }}>
              생성된 채팅방으로 이동하기
            </Typography>
            <ChevronRight sx={{ color: "#FF0B55" }} />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            mb: 1,
            justifyContent: "center",
          }}
        >
          {/* <Button
            variant="outlined"
            color="primary"
            sx={{
              borderColor: "#FF0B55",
              color: "#FF0B55",
              "&:hover": {
                borderColor: "#e6004c",
                color: "#e6004c",
              },
              borderRadius: "8px",
              margin: "0 8px",
            }}
          >
            채팅하기
          </Button> */}
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderColor: "#ccc",
              color: "#333",
              width: "100px",
              borderRadius: "8px",
              margin: "0 8px",
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmTrade}
            variant="contained"
            color="primary"
            sx={{
              width: "100px",
              backgroundColor: "#FF0B55",
              color: "white",
              boxShadow: "none",
              borderRadius: "8px",
              margin: "0 8px",
            }}
          >
            거래확정
          </Button>
        </DialogActions>
      </Dialog>

      {/* 채팅방 미생성 알림 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          width: "80%",
          position: "fixed",
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2,
          },
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {tradeDone.length > 0 && (
        <Box
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
            <PlaceRounded />
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.90)",
                fontSize: 16,
                fontFamily: "Noto Sans KR",
                fontWeight: "900",
                lineHeight: "22.40px",
              }}
            >
              거래완료
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
            {tradeDone.map((trade, index) => (
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
                  {trade.buyerId === userId ? (
                    <ShoppingCart />
                  ) : trade.sellerId === userId ? (
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
                      width: "60%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        fontFamily: "Noto Sans KR",
                        fontWeight: "400",
                      }}
                    >
                      {trade.tradePlace}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 10,
                        fontFamily: "Noto Sans KR",
                        fontWeight: "400",
                      }}
                    >
                      {trade.productName} · {formatPrice(trade.productPrice)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "35%",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "rgba(0, 0, 0, 0.90)",
                        fontSize: 14,
                        fontFamily: "Noto Sans KR",
                        fontWeight: "400",
                      }}
                    >
                      {formatTime(trade.tradeTime)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CalendarTrade;
