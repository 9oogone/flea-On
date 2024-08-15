import React, { useEffect, useRef, useState } from "react";
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
import { formatPrice } from "../utils/cssUtils";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ReactComponent as LevelBaby } from "../assets/images/level_baby.svg";
import { ReactComponent as LevelSmall } from "../assets/images/level_small.svg";
import { ReactComponent as LevelMiddle } from "../assets/images/level_middle.svg";
import { ReactComponent as LevelBig } from "../assets/images/level_big.svg";
// import ReplayIcon from "@mui/icons-material/Replay";

const OpenVideo = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isFirst, setIsFirst] = useState(true);
  const dispatch = useDispatch();
  const { sessionName } = useParams();
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [sttValue, setSttValue] = useState("");
  // const [publisher, setPublisher] = useState(undefined);
  const [currentRecordingId, setCurrentRecordingId] = useState("");
  const [recordStartTime, setRecordStartTime] = useState(null);
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState({});
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [shortsId, setShortsId] = useState({ shortsId: 0, index: 0 });
  const [times, setTimes] = useState([]);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0)
  const [soldIndex, setSoldIndex] = useState(0);
  const publisher = useRef();
  const navigate = useNavigate();
  
  const handleCustomerClick = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log("productList 바뀜");
    console.log(productList);
  }, [productList]);
  useEffect(() => {
    console.log("빈배열 로그");
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

  const OV = useRef();
  const session = useRef();
  const user = useSelector((state) => state.auth.user);
  const handlePopState = (event) => {
    if (session.current) {
      session.current.disconnect();
    }
    if (publisher.current) {
      publisher.current = null;
    }
  };

  useDidMountEffect(() => {
    console.log("또들어옴?");
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
      var subscriber = session.subscribe(event.stream, undefined, {
        resolution: "405x1080",
        frameRate: 15,
      });
      subscriber.addVideoElement(videoRef.current);
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
        setIsFirst(false);
        setIsRecording(data.isRecording);
        setIsFirst(false);
      } else if (type === 3) {
        // productList[data.index].status += 1;
        setSoldIndex(data.index);
      } else if (type === 4) {
        setTimeout(() => {
          setShortsId({ shortsId: data.shortsId, index: data.index });
          console.log("currentProductIndex : ", currentProductIndex);
          console.log("productList : ", productList);
        }, 300);
        // productList[currentProductIndex].shortsId = data.shortsId;
      } else if (type === 5) {
        navigate("/");
      }
    });
    try {
      const resp = await getToken({ sessionName: sessionName });
      let token = resp[0];
      await session.connect(token, { clientData: "example" });
      if (resp[1] === true) {
        setIsPublisher(true);
        publisher.current = OV.current.initPublisher(
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
              publisher.current.addVideoElement(videoRef.current);
              session.publish(publisher.current);
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
      // var len = videoDevices.length;
      
      if (videoDevices.length > 1) {
        // if(videoIndex+1>=len){
        //   setVideoIndex(0)
        // }else{
        //   setVideoIndex(videoIndex+1)
        // }
        const newPublisher = OV.current.initPublisher("htmlVideo", {
          videoSource: 
          // videoDevices[videoIndex].deviceId,
          // vidoeIndex+1>len?
          isFrontCamera
            ? videoDevices[0].deviceId
            : videoDevices[2].deviceId,
          publishAudio: true,
          publishVideo: true,
          mirror: isFrontCamera,
          resolution: "405x1080",
          frameRate: 30,
          insertMode: "APPEND",
        });

        setIsFrontCamera(!isFrontCamera);

        session.current.unpublish(publisher.current).then(() => {
          publisher.current = newPublisher;
          session.current.publish(newPublisher).then(() => {
            publisher.current.addVideoElement(videoRef.current);
          });
        });
      }
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

      const productsWithStatus = products.map((product) => ({
        ...product,
        status: 0,
        shortsId: 0,
      }));
      for (let index = 0; index < productsWithStatus.length; index++) {
        const product = productsWithStatus[index];
        if (product.sellStatus < 2) {
          setCurrentProduct(productsWithStatus[index]); // 첫 번째 상품 설정
          setCurrentProductIndex(index);
          break;
        }
      }
      setTitle(title);
      setSeller(user);
      setProductList(productsWithStatus);

      setPlace(tradePlace);
      setLiveDate(live_date);
      const timeSlots = generateTimeSlots(liveTradeTimes);
      setTimes(timeSlots);
      console.log(productsWithStatus, productsWithStatus[0]);
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
      const messageData = {
        type: 2,
        isRecording: false,
      };

      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });

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
              const messageSeconds = Math.floor(
                timeDifferenceInMs / 1000
              ).toString();
              const formattedTime = `${messageSeconds}`;
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
            inputText: {
              text: sttValue,
            },
          };
          baseAxios()
            .post("fleaon/shorts/save", data)
            .then((response) => {
              console.log("쇼츠 id : ", response.data);
              console.log(" data : ", data);
              // productList[currentProductIndex].shortsId = response.data;
              const messageData = {
                type: 4,
                shortsId: response.data,
                index: currentProductIndex,
              };

              session.current.signal({
                data: JSON.stringify(messageData),
                type: "chat",
              });
            })
            .catch((error) => {
              console.log(error);
              console.log(data);
            });
        })
        .catch((error) => {
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized.");
    }
  };

  useEffect(() => {
    console.log("들어왔니?", isRecording);
    if (!isRecording && !isFirst) {
      setCurrentProductIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex < productList.length) {
          setCurrentProduct(productList[newIndex]);
        }
        return newIndex;
      });
    }
  }, [isRecording, productList, isFirst]);

  useEffect(() => {
    if (soldIndex !== 0) {
      productList[soldIndex].status += 1;
    }
  }, [soldIndex]);
  useEffect(() => {
    if (shortsId.index !== 0) {
      console.log(shortsId);
      productList[shortsId.index].shortsId = shortsId.shortsId;
    }
  }, [shortsId]);

  const handlePrepareProduct = (index) => {
    const newProductList = [...productList];
    const [selectedProduct] = newProductList.splice(index, 1);
    newProductList.splice(currentProductIndex + 1, 0, selectedProduct);
    setProductList(newProductList);
  };

  const handleBuy = async (productId, productIndex) => {
    setSelectedProductId(productId);
    try {
      const response = await baseAxios().post("/fleaon/purchase/buy", {
        productId: productId,
        userId: user.userId,
      });
      if (response.status === 200) {
        if (response.data === 7) {
          // handle specific case
        } else {
          handleCustomerClick();
        }
        productList[productIndex].status += 100;
        const messageData = {
          type: 3,
          productIndex: productIndex,
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

  const handleReserve = async (productIndex) => {
    try {
      const response = await baseAxios().post("fleaon/purchase/reserve", {
        productId: productList[productIndex].productId,
        userId: user.userId,
      });
      if (response.status === 200) {
        productList[productIndex].status += 50;

        const messageData = {
          type: 3,
          productIndex: productIndex,
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
      const messageData = {
        type: 5,
      };
      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      if (session.current) {
        session.current.disconnect();
      }
      if (publisher.current) {
        publisher.current=null;
      }
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
                    {formatPrice(currentProduct.price)}
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
              ) : (
                <Box>
                  {currentProduct?.status > 99 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled
                      onClick={() => handleReserve(currentProductIndex)}
                      sx={{ width: "36vw", color: "white" }}
                    >
                      구매완료
                    </Button>
                  ) : currentProduct?.status > 49 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled
                      onClick={() => handleReserve(currentProductIndex)}
                      sx={{ width: "36vw", color: "white" }}
                    >
                      예약 완료
                    </Button>
                  ) : currentProduct?.status >= 6 ? (
                    <Button
                      variant="contained"
                      color="orange"
                      disabled
                      sx={{
                        width: "60vw",
                        height: "6vh",
                        "&.Mui-disabled": {
                          color: "white",
                        },
                      }}
                    >
                      구매 불가
                    </Button>
                  ) : currentProduct?.status > 0 ? (
                    <Button
                      variant="contained"
                      color="orange"
                      onClick={() => handleReserve(currentProductIndex)}
                      sx={{
                        width: "60vw",
                        height: "6vh",
                        color: "white",
                        "&.Mui-disabled": {
                          color: "white",
                        },
                      }}
                    >
                      줄서기
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={!isRecording}
                      onClick={() =>
                        handleBuy(currentProduct.productId, currentProductIndex)
                      }
                      sx={{ width: "60vw", height: "6vh" }}
                    >
                      {isRecording ? "구매하기" : "상품 준비중"}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              height: "100vh",
              backdropFilter: "blur(10px)",
              display: "fixed",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              pr: 5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 15 }}>
              <ArrowBackIosNewIcon sx={{ color: "white", fontSize: 28 }} />
              <Box
                sx={{
                  display: "flex",

                  marginBottom: 2,
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    gap: 0.8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "white", fontSize: 25 }}>
                    {title}
                  </Typography>
                  {seller.level < 2 ? (
                    <LevelBaby />
                  ) : seller.level < 7 ? (
                    <LevelSmall />
                  ) : seller.level < 26 ? (
                    <LevelMiddle />
                  ) : (
                    <LevelBig />
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={seller.profilePicture}
                    alt={seller.nickname}
                    sx={{ marginRight: 1.5, width: 24, height: 24 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {seller.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ color: "white", my: 3, pl: 5 }}>
                상품 목록
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {productList.map((product, index) => (
                  <Box
                    sx={{
                      width: "90%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      borderBottom: "0.33px solid rgba(240, 240, 240, 0.5)",
                      py: 1.5,
                    }}
                  >
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "95%",
                      }}
                    >
                      <Box
                        sx={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{ fontWeight: "bold", color: "white" }}
                          >
                            {product.name}
                          </Typography>
                          <Typography sx={{ color: "white" }}>
                            {formatPrice(product.price)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        {/* <Button
                    color="google"
                    onClick={() =>
                      product.shortsId === 0
                        ? ""
                        : navigate(`/shorts/${product.shortsId}`)
                    }
                  >
                    <ReplayIcon />
                  </Button> */}
                        {isPublisher ? (
                          <Button
                            variant="contained"
                            color={
                              index <= currentProductIndex
                                ? "primary"
                                : "secondary"
                            }
                            onClick={() =>
                              handlePrepareProduct(
                                index + currentProductIndex + 1
                              )
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
                        ) : index === currentProductIndex ? (
                          <Box>
                            {currentProduct.status > 99 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                onClick={() =>
                                  handleReserve(currentProductIndex)
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                구매완료
                              </Button>
                            ) : currentProduct.status > 49 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                onClick={() =>
                                  handleReserve(currentProductIndex)
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                예약 완료
                              </Button>
                            ) : currentProduct.status > 0 &&
                              currentProduct.status < 6 ? (
                              <Button
                                variant="contained"
                                color="orange"
                                onClick={() =>
                                  handleReserve(currentProductIndex)
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                줄서기
                              </Button>
                            ) : currentProduct.status == 0 ? (
                              <Button
                                variant="contained"
                                color="secondary"
                                disabled={!isRecording}
                                onClick={() =>
                                  handleBuy(
                                    currentProduct.productId,
                                    currentProductIndex
                                  )
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                {isRecording ? "구매하기" : "상품 준비중"}
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                onClick={() =>
                                  handleBuy(
                                    currentProduct.productId,
                                    currentProductIndex
                                  )
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                구매 불가
                              </Button>
                            )}
                          </Box>
                        ) : index < currentProductIndex ? (
                          <Box>
                            {product.status > 99 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                sx={{ width: "36vw", color: "white" }}
                              >
                                구매완료
                              </Button>
                            ) : product.status > 49 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                sx={{ width: "36vw", color: "white" }}
                              >
                                예약 완료
                              </Button>
                            ) : product.status === 0 ? (
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                  handleBuy(product.productId, index)
                                }
                                sx={{ width: "36vw", color: "white" }}
                              >
                                구매하기
                              </Button>
                            ) : product.status > 0 && product.status < 6 ? (
                              <Button
                                variant="contained"
                                color="orange"
                                onClick={() => handleReserve(index)}
                                sx={{ width: "36vw", color: "white" }}
                              >
                                줄서기
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="secondary"
                                disabled={true}
                                sx={{ width: "36vw", color: "white" }}
                              >
                                구매 불가
                              </Button>
                            )}
                          </Box>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={true}
                            sx={{ width: "36vw", color: "white" }}
                          >
                            방송예정
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Slider>
      </Box>
      <CustomerDateTimeSelector
        open={open}
        handleClose={handleClose}
        place={place}
        liveDate={liveDate}
        times={times}
        selectedProductId={selectedProductId}
        user={user}
        seller={seller}
        liveId={sessionName}
      />
    </div>
  );
};

export default OpenVideo;
