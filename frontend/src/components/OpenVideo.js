import React, { useEffect, useRef, useState, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, unSetLoading } from "../features/live/loadingSlice";
import { getToken, startRecording, stopRecording } from "../api/openViduAPI";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Avatar,
} from "@mui/material";
import Slider from "react-slick";
import baseAxios from "../utils/httpCommons";
import { useSpeechRecognition } from "react-speech-kit";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDidMountEffect from "../utils/useDidMountEffect";
import CustomerDateTimeSelector from "./CustomerDateTimeSelector";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import swipeLeftImage from "../assets/images/swipe_left.svg";

const OpenVideo = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productList, setProductList] = useState([{ productId: 1 }]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false); // 추가
  const dispatch = useDispatch();
  const { sessionName } = useParams();
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [sttValue, setSttValue] = useState("");
  const [publisher, setPublisher] = useState(undefined);
  const [currentRecordingId, setCurrentRecordingId] = useState("");
  const [recordStartTime, setRecordStartTime] = useState(null);
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState({});
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [times, setTimes] = useState([]);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const navigate = useNavigate();
  const [isSold, setIsSold] = useState(false);
  const [reserveCount, setReserveCount] = useState(0);

  const handleCustomerClick = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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

  let subscribers = [];
  const OV = useRef();
  const session = useRef();
  const user = useSelector((state) => state.auth.user);
  const handlePopState = (event) => {
    if (session.current) {
      session.current.disconnect();
    }
    if (publisher) {
      publisher = null;
    }
  };

  useDidMountEffect(() => {
    OV.current = new OpenVidu();
    window.addEventListener("popstate", handlePopState);
    if (sessionName) {
      dispatch(setLoading());
      MakeSession(videoRef, dispatch, sessionName)
        .then((ss) => {
          session.current = ss;
          fetchProductList(sessionName);
        })
        .catch((error) => {
          dispatch(unSetLoading());
        });
    }
  }, [sessionName]);

  const MakeSession = async (videoRef, dispatch, sessionName) => {
    const session = OV.current.initSession();
    session.on("streamCreated", (event) => {
      var subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
      if (videoRef.current) {
        subscriber.addVideoElement(videoRef.current);
      }
    });
    session.on("signal:chat", (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      if (type === 1) {
        const message = data.message;
        const from = data.from;
        const profile = data.profile;
        const userId = data.userId;
        const time = data.time;
        setMessages((prevMessages) => [
          ...prevMessages,
          { from, message, profile, userId, time },
        ]);
      } else if (type === 2) {
        setIsRecording(data.isRecording);
      } else if (type === 3) {
        setIsSold(data.isSold);
        setIsPurchaseCompleted(true); // 추가
      } else if (type === 4) {
        setReserveCount(data.reserveCount);
      }
    });
    try {
      const resp = await getToken({ sessionName: sessionName });
      let token = resp[0];
      await session.connect(token, { clientData: "example" });
      if (resp[1] === true) {
        setIsPublisher(true);
        let publisher = OV.current.initPublisher(
          undefined,
          {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "405x1080",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          },
          () => {
            if (videoRef.current) {
              publisher.addVideoElement(videoRef.current);
              session.publish(publisher);
              dispatch(unSetLoading());
            }
          },
          (error) => {
            dispatch(unSetLoading());
          }
        );
      }
      return session;
    } catch (error) {
      dispatch(unSetLoading());
    }
  };

  const switchCamera = () => {
    OV.current.getDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const newPublisher = OV.current.initPublisher("htmlVideo", {
        videoSource: isFrontCamera
          ? videoDevices[0].deviceId
          : videoDevices[0].deviceId,
        publishAudio: true,
        publishVideo: true,
        mirror: isFrontCamera,
        resolution: "405x1080",
        frameRate: 30,
        insertMode: "APPEND",
      });
      setIsFrontCamera(!isFrontCamera);
      session.current.unpublish(publisher).then(() => {
        setPublisher(newPublisher);
        session.current.publish(newPublisher).then(() => {
          if (videoRef.current) {
            publisher.addVideoElement(videoRef.current);
          }
        });
      });
    });
  };

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setSttValue(result);
    },
    onEnd: () => {
      listen({ continuous: true });
    },
  });

  const fetchProductList = async (sessionName) => {
    try {
      const response = await baseAxios().get(
        `/fleaOn/live/${sessionName}/detail`
      );
      const {
        title,
        products,
        tradePlace,
        liveDate: live_date,
        liveTradeTimes,
        user,
      } = response.data;
      setTitle(title);
      setSeller(user);
      setProductList(products);
      setCurrentProduct(products[0]);
      setPlace(tradePlace);
      setLiveDate(live_date);
      const timeSlots = generateTimeSlots(liveTradeTimes);
      setTimes(timeSlots);
    } catch (error) {
      console.error("상품 목록 가져오기 오류:", error);
    }
  };

  const handleRecordStart = () => {
    if (session.current && currentProductIndex < productList.length) {
      const messageData = {
        type: 2,
        isRecording: true,
      };
      setTimeout(() => {
        session.current.signal({
          data: JSON.stringify(messageData),
          type: "chat",
        });
      }, 5000);
      dispatch(setLoading());
      startRecording({
        session: session.current.sessionId,
        outputMode: "COMPOSED_QUICK_START",
        hasAudio: true,
        hasVideo: true,
      })
        .then((res) => {
          setRecordStartTime(new Date());
          setCurrentRecordingId(res.data.id);
          setIsRecording(true);
          dispatch(unSetLoading());
          listen({ continuous: true });
        })
        .catch((error) => {
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized or no more products.");
    }
  };

  const handleRecordStop = () => {
    if (session.current) {
      stop();
      dispatch(setLoading());
      stopRecording({
        recording: currentRecordingId,
      })
        .then(() => {
          setIsRecording(false);
          dispatch(unSetLoading());
          const recordStopTime = new Date();
          const durationInMs = recordStopTime - recordStartTime;
          const hours = Math.floor(durationInMs / 3600000)
            .toString()
            .padStart(2, "0");
          const minutes = Math.floor((durationInMs % 3600000) / 60000)
            .toString()
            .padStart(2, "0");
          const seconds = Math.floor((durationInMs % 60000) / 1000)
            .toString()
            .padStart(2, "0");
          const length = `${hours}:${minutes}:${seconds}`;
          const videoAddress = `https://i11b202.p.ssafy.io/openvidu/recordings/${currentRecordingId}/${currentRecordingId}.mp4`;
          const thumbnail = `https://i11b202.p.ssafy.io/openvidu/recordings/${currentRecordingId}/${currentRecordingId}.jpg`;
          const shortsChatRequests = messages
            .filter((message) => {
              const messageTime = new Date(message.time);
              return (
                messageTime >= recordStartTime && messageTime <= recordStopTime
              );
            })
            .map((message) => {
              const messageTime = new Date(message.time);
              const timeDifferenceInMs = messageTime - recordStartTime;
              const messageHours = Math.floor(timeDifferenceInMs / 3600000)
                .toString()
                .padStart(2, "0");
              const messageMinutes = Math.floor(
                (timeDifferenceInMs % 3600000) / 60000
              )
                .toString()
                .padStart(2, "0");
              const messageSeconds = Math.floor(
                (timeDifferenceInMs % 60000) / 1000
              )
                .toString()
                .padStart(2, "0");
              const formattedTime = `${messageHours}:${messageMinutes}:${messageSeconds}`;
              return {
                content: message.message,
                time: formattedTime,
                userId: message.userId,
              };
            });
          const data = {
            thumbnail,
            length,
            videoAddress,
            productId: currentProduct.productId,
            shortsChatRequests,
          };
          baseAxios()
            .post("fleaon/shorts/save", data)
            .then((response) => {})
            .catch((error) => {});
          setCurrentProductIndex(currentProductIndex + 1);
          if (currentProductIndex < productList.length - 1) {
            setCurrentProduct(productList[currentProductIndex + 1]);
          }
        })
        .catch((error) => {
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized.");
    }
  };

  const handlePrepareProduct = (index) => {
    const newProductList = [...productList];
    const [selectedProduct] = newProductList.splice(index, 1);
    newProductList.splice(currentProductIndex + 1, 0, selectedProduct);
    setProductList(newProductList);
  };

  const handleBuy = async (productId) => {
    setSelectedProductId(productId);
    try {
      const response = await baseAxios().post("/fleaon/purchase/buy", {
        productId: productList[currentProductIndex].productId,
        userId: user.userId,
      });
      if (response.status === 200) {
        handleCustomerClick();
        setIsSold(true);
        setIsPurchaseCompleted(true); // 추가
        const messageData = {
          type: 3,
          isSold: true,
        };
        session.current.signal({
          data: JSON.stringify(messageData),
          type: "chat",
        });
      } else {
        console.error("Purchase failed:", response);
      }
    } catch (error) {
      console.error("Error purchasing product:", error);
    }
  };

  const handleReserve = async () => {
    try {
      const response = await baseAxios().post("fleaon/purchase/reserve", {
        productId: productList[currentProductIndex].productId,
        userId: user.userId,
      });
      if (response.status === 200) {
        setReserveCount(reserveCount + 1);
        const messageData = {
          type: 4,
          reserveCount: reserveCount + 1,
        };
        session.current.signal({
          data: JSON.stringify(messageData),
          type: "chat",
        });
      } else {
        console.error("Reservation failed:", response);
      }
    } catch (error) {
      console.error("Error reserving product:", error);
    }
  };

  const sendMessage = () => {
    if (session.current && newMessage.trim() !== "") {
      const messageData = {
        type: 1,
        userId: user.userId,
        message: newMessage,
        from: user.nickname,
        profile: user.profilePicture,
        time: new Date(),
      };
      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setNewMessage("");
    }
  };

  const endBroadcast = async () => {
    try {
      await baseAxios().put(`/fleaOn/live/${sessionName}/off`);
      navigate("/");
    } catch (error) {
      console.error("방송 종료 실패", error);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <video
        id="htmlVideo"
        autoPlay={true}
        ref={videoRef}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "-1",
        }}
      ></video>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.2) 100%)",
          zIndex: "-1",
        }}
      ></div>
      <Box>
        <Slider {...sliderSettings}>
          <Box
            sx={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <img
              src={swipeLeftImage}
              alt="swipe"
              style={{ position: "absolute", right: 0, top: "40%" }}
            />
            <IconButton sx={{ marginLeft: "90%" }} onClick={() => navigate(-1)}>
              <CloseIcon color="google" />
            </IconButton>
            <IconButton id="buttonSwitchCamera" onClick={switchCamera}>
              <FlipCameraAndroidIcon color="google" />
            </IconButton>
            <Box
              ref={messagesContainerRef}
              sx={{
                mt: 58,
                height: 200,
                overflowY: "auto",
                position: "relative",
                padding: 1,
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    src={msg.profile}
                    alt={msg.from}
                    sx={{ marginRight: 2, width: 32, height: 32 }}
                  />
                  <Box
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      borderRadius: "16px",
                      padding: "8px 16px",
                      maxWidth: "60%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      {msg.from}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white" }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                pr: 3,
                pl: 3,
              }}
            >
              <TextField
                type="text"
                value={newMessage}
                color="google"
                InputProps={{
                  sx: {
                    borderRadius: "99px",
                    color: "white",
                  },
                }}
                onChange={(e) => setNewMessage(e.target.value)}
                fullWidth
                sx={{
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  color: "white",
                }}
              />
              <IconButton onClick={sendMessage}>
                <SendIcon color="google" />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                mt: 3,
              }}
            >
              {currentProduct && (
                <Box sx={{ color: "white" }}>
                  <Typography variant="h5">{currentProduct.name}</Typography>
                  <Typography variant="body1">
                    {currentProduct.price}원
                  </Typography>
                </Box>
              )}
              {isPublisher ? (
                <Box>
                  {currentProductIndex < productList.length ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={
                        isRecording ? handleRecordStop : handleRecordStart
                      }
                      sx={{ width: "60vw", height: "6vh", fontSize: 20 }}
                    >
                      {isRecording ? "다음 상품 준비" : "판매시작"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={endBroadcast}
                      sx={{ width: "60vw", height: "6vh" }}
                    >
                      방송종료
                    </Button>
                  )}
                </Box>
              ) : isSold || isPurchaseCompleted ? (
                <Button
                  variant="contained"
                  color="orange"
                  disabled
                  sx={{ width: "60vw", height: "6vh" }}
                >
                  구매 종료
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!isRecording}
                  onClick={() => handleBuy(currentProduct.id)}
                  sx={{ width: "60vw", height: "6vh" }}
                >
                  {isRecording ? "구매하기" : "상품 준비중"}
                </Button>
              )}
              {!isPublisher && isSold && !isPurchaseCompleted && (
                <Button
                  variant="contained"
                  color="orange"
                  onClick={handleReserve}
                  disabled={reserveCount >= 5}
                  sx={{ width: "60vw", height: "6vh" }}
                >
                  {reserveCount >= 5 ? "구매 불가" : "줄서기"}
                </Button>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.12)",
              height: "100vh",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              pr: 5,
              pl: 5,
              pt: 15,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Avatar
                src={seller.profilePicture}
                alt={seller.nickname}
                sx={{ marginRight: 2, width: 32, height: 32 }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {seller.nickname}
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {title}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ color: "white", marginBottom: 5 }}>
              상품 목록
            </Typography>
            {productList.map((product, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    가격: {product.price}원
                  </Typography>
                </Box>
                {isPublisher ? (
                  <Button
                    variant="contained"
                    color={
                      index <= currentProductIndex ? "primary" : "secondary"
                    }
                    onClick={() =>
                      handlePrepareProduct(index + currentProductIndex + 1)
                    }
                    disabled={index <= currentProductIndex}
                    sx={{
                      width: "36vw",
                      color: "white",
                      "&.Mui-disabled": {
                        color: "white",
                      },
                    }}
                  >
                    {index < currentProductIndex
                      ? "방송 종료"
                      : index === currentProductIndex
                      ? "방송 중"
                      : "이 상품 준비하기"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color={
                      index === currentProductIndex ? "secondary" : "primary"
                    }
                    disabled={index !== currentProductIndex}
                    onClick={() => handleBuy(product.id)}
                    sx={{
                      width: "36vw",
                      color: "white",
                      "&.Mui-disabled": {
                        color: "white",
                      },
                    }}
                  >
                    {index === currentProductIndex ? "구매하기" : "방송예정"}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Slider>
      </Box>
      <CustomerDateTimeSelector
        open={open}
        handleClose={handleClose}
        place={place}
        liveDate={liveDate}
        times={times}
        currentProductIndex={productList[currentProductIndex].productId}
        userId={user.userId}
        sellerId={seller.userId}
        liveId={sessionName}
      />
    </div>
  );
};

export default OpenVideo;
