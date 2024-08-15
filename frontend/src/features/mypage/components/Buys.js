import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchChats } from "../../chat/chatSlice";
import { Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { formatPrice, getRelativeDate } from "../../../utils/cssUtils";

const Buys = ({ items }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buyerId = useSelector((state) => state.auth.user.userId);
  // console.log(buyerId, "구매자 아이디입니당");
  const { chats, status } = useSelector((state) => state.chat);
  const [buy, setBuy] = useState();
  const [buyDone, setBuyDone] = useState();
  useEffect(() => {
    setBuy(items.purchases);
    setBuyDone(items.tradeDoneResponses);
  }, [items]);
  // console.log(buy, "거래예정입니다.");
  // console.log(buyDone, "거래완료입니다.");

  // 채팅하기
  // chat에 buyer.id 필요,,
  // .get("/fleaon/chat")
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChats());
    }
    // console.log(chats);
  }, [status, dispatch]);
  // console.log(chats, status, "챗 디스패치입니다");

  const goToChatRoom = (chats, buyerId) => {
    const chat = chats.find((chat) => chat.buyerId === buyerId);

    if (chat) {
      // 채팅 객체가 존재하면 해당 채팅방으로 이동
      navigate(`/chat/${chat.chattingId}`, { state: chat });
    } else {
      console.log("채팅방 가기 실패!!");
    }
  };

  return (
    <Box>
      {buy?.length === 0 && buyDone?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "grey.700", textAlign: "center" }}
          >
            아직 구매를 안했어요.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {buy?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  py: 2,
                  width: "90%",
                  height: "100%",
                  borderBottom: "0.33px solid rgba(84, 84, 86, 0.34)",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    width: "95%",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1.2,
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 24,
                          backgroundColor: "#FF0B55",
                          borderRadius: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          거래예정
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: 17,
                          wordWrap: "break-word",
                        }}
                      >
                        {item.productName}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        alignSelf: "stretch",
                        color: "rgba(128, 128, 128, 0.55)",
                        fontSize: 11,
                        wordWrap: "break-word",
                      }}
                    >
                      {item.dongName} · {getRelativeDate(item.tradeDate)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: 0.5,
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        pr: 1,
                        fontSize: 17,
                      }}
                    >
                      {formatPrice(item.productPrice)}
                    </Typography>
                    <Box
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        display: "flex",
                      }}
                      onClick={() => goToChatRoom(chats, buyerId)}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: 12,
                          letterSpacing: "0.1px",
                        }}
                      >
                        채팅하기
                      </Typography>
                      <ChevronRight />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* 거래완료 구매내역 */}
          {buyDone?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  py: 2,
                  width: "90%",
                  height: "100%",
                  borderBottom: "0.33px solid rgba(84, 84, 86, 0.34)",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    width: "95%",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                      gap: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.6,
                        display: "flex",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: 17,
                          wordWrap: "break-word",
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <Box
                        sx={{
                          width: 60,
                          height: 24,
                          backgroundColor: "#CCCCCC",
                          borderRadius: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          거래완료
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        alignSelf: "stretch",
                        color: "rgba(128, 128, 128, 0.55)",
                        fontSize: 11,
                        wordWrap: "break-word",
                      }}
                    >
                      {getRelativeDate(item.tradeDate)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: 0.5,
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        pr: 1,
                        fontSize: 17,
                      }}
                    >
                      {formatPrice(item.productPrice)}
                    </Typography>
                    <Box
                      sx={{
                        justifyContent: "flex-start",
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
                      >
                        {/* 상세보기 */}
                      </Typography>
                      {/* <ChevronRight /> */}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Buys;
