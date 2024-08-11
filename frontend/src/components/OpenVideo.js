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
  Modal,
  TextField,
  Avatar,
} from "@mui/material";
import Slider from "react-slick";
import baseAxios from "../utils/httpCommons";
import { useSpeechRecognition } from "react-speech-kit";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDidMountEffect from "../utils/useDidMountEffect";
import Calendar from "../components/SelectTradeTime"; // SelectTradeTime 컴포넌트를 불러옵니다.
import CustomerDateTimeSelector from "./CustomerDateTimeSelector";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import swipeLeftImage from "../assets/images/swipe_left.svg";
const OpenVideo = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태를 추가합니다.
  const [selectedProductId, setSelectedProductId] = useState(null); // 선택한 제품 ID 상태를 추가합니다.
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
  //거래장소시간 선택 모달
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [times, setTimes] = useState([]);
  const navigate = useNavigate();
  const handleCustomerClick = () => {
    // 이미 가져온 데이터를 사용하여 상태 업데이트
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const generateTimeSlots = (tradeTimes) => {
    const slots = [];

    tradeTimes.forEach((time) => {
      try {
        let start = new Date(`${time.date}T${time.tradeStart}`);
        const end = new Date(`${time.date}T${time.tradeEnd}`);

        // Date 객체가 유효한지 확인
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date format");
        }

        while (start < end) {
          slots.push({
            time: start.toTimeString().slice(0, 5), // 'HH:MM' 형식으로 시간 추출
            date: time.date,
          });

          // 새로운 Date 객체를 생성하여 30분을 추가합니다.
          start = new Date(start.getTime() + 30 * 60000); // 30분 = 30 * 60000 밀리초
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
    console.log("test");
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
          console.log("MakeSession 성공");
          session.current = ss;
          fetchProductList(sessionName);
        })
        .catch((error) => {
          console.error("MakeSession 오류:", error);
          dispatch(unSetLoading());
        });
    }
  }, [sessionName]);

  const MakeSession = async (videoRef, dispatch, sessionName) => {
    const session = OV.current.initSession();

    session.on("streamCreated", (event) => {
      var subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
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
        setIsRecording(data.isRecording);
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
            publisher.addVideoElement(videoRef.current);
            session.publish(publisher);
            dispatch(unSetLoading());
          },
          (error) => {
            console.error(error);
            dispatch(unSetLoading());
          }
        );
      }
      return session;
    } catch (error) {
      console.error("세션 설정 중 오류 발생:", error);
      dispatch(unSetLoading());
    }
  };

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setSttValue(result);
    },
    onEnd: () => {
      listen({ continuous: true });
    },
  });
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  function switchCamera() {
    OV.current.getDevices().then((devices) => {
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newPublisher = OV.initPublisher("html-element-id", {
          videoSource: isFrontCamera
            ? videoDevices[1].deviceId
            : videoDevices[0].deviceId,
          publishAudio: true,
          publishVideo: true,
          mirror: isFrontCamera,
        });

        setIsFrontCamera(isFrontCamera);

        session.unpublish(publisher).then(() => {
          console.log("Old publisher unpublished!");

          publisher = newPublisher;

          this.session.publish(publisher).then(() => {
            console.log("New publisher published!");
          });
        });
      }
    });
  }

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
      console.log(response.data);
      setTitle(title);
      setSeller(user);
      setProductList(products);
      setCurrentProduct(products[0]); // 첫 번째 상품 설정
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
      setRecordStartTime(new Date()); // 녹화 시작 시간 설정
      startRecording({
        session: session.current.sessionId,
        outputMode: "COMPOSED_QUICK_START",
        hasAudio: true,
        hasVideo: true,
      })
        .then((res) => {
          console.log(res.data.id);
          setCurrentRecordingId(res.data.id);
          setIsRecording(true);
          dispatch(unSetLoading());
          listen({ continuous: true });
        })
        .catch((error) => {
          console.error("녹화 시작 중 오류 발생:", error);
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized or no more products.");
    }
  };

  const handleRecordStop = () => {
    if (session.current) {
      console.log(session.current.sessionId);
      stop();
      dispatch(setLoading());
      stopRecording({
        recording: currentRecordingId,
      })
        .then(() => {
          setIsRecording(false);
          dispatch(unSetLoading());

          // 녹화 종료 시간 설정
          const recordStopTime = new Date();
          const durationInMs = recordStopTime - recordStartTime;
          console.log("durationInMs : ", durationInMs);
          // 시간 차이를 정확하게 계산하여 HH:mm:ss 형식의 문자열로 변환
          const hours = Math.floor(durationInMs / 3600000)
            .toString()
            .padStart(2, "0");
          console.log("hours : ", hours);
          const minutes = Math.floor((durationInMs % 3600000) / 60000)
            .toString()
            .padStart(2, "0");
          console.log("minutes : ", minutes);
          const seconds = Math.floor((durationInMs % 60000) / 1000)
            .toString()
            .padStart(2, "0");
          console.log("seconds : ", seconds);
          const length = `${hours}:${minutes}:${seconds}`;
          console.log(length);
          // 녹화 데이터 및 채팅 메시지를 서버로 전송
          const videoAddress = `https://i11b202.p.ssafy.io/openvidu/recordings/${currentRecordingId}/${currentRecordingId}.mp4`;
          const thumbnail = `https://i11b202.p.ssafy.io/openvidu/recordings/${currentRecordingId}/${currentRecordingId}.jpg`;

          // 채팅 메시지의 시간을 녹화 시작 시간과 종료 시간 기준으로 변환
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
            .then((response) => {
              console.log("녹화 데이터 전송 성공:", response.data);
            })
            .catch((error) => {
              console.log(data, messages);
              console.error("녹화 데이터 전송 중 오류 발생:", error);
            });

          // 다음 상품 준비
          if (currentProductIndex < productList.length - 1) {
            setCurrentProductIndex(currentProductIndex + 1);
            setCurrentProduct(productList[currentProductIndex + 1]);
          }
        })
        .catch((error) => {
          console.error("녹화 중지 중 오류 발생:", error);
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

  const handleBuy = (productId) => {
    setSelectedProductId(productId);
    handleCustomerClick();
    setIsModalOpen(true); // 모달을 엽니다.
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
    console.log("방송 종료");
    try {
      await baseAxios().put(`/fleaOn/live/${sessionName}`);
      navigate("/");
    } catch (error) {
      console.error("방송 종료 실패", error);
      // 오류 처리를 여기서 할 수 있습니다 (예: 사용자에게 오류 메시지 표시)
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
  const InputTextField = styled(TextField)({
    "& label": {
      // placeholder text color
      color: "var(--sub-text)",
    },
    "& label.Mui-focused": {
      // 해당 input focus 되었을 때 placeholder text color
      // floatng label을 사용할 때 처리 필요하다
      color: "var(--primary)",
    },
    "& label.Mui-error": {
      color: "#d32f2f",
    },
    "& .MuiOutlinedInput-root": {
      color: "var(--text)",
      "& fieldset": {
        borderColor: "var(--sub-text)",
      },
    },
  });

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <video
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
                height: 200, // 메시지 목록의 최대 높이를 설정합니다.
                overflowY: "auto", // 세로 스크롤이 가능하게 합니다.
                position: "relative", // 흐림 효과를 위한 상대 위치 설정
                padding: 1, // 메시지 목록의 패딩
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: 2, // 더 나은 가독성을 위한 여백
                  }}
                >
                  <Avatar
                    src={msg.profile}
                    alt={msg.from}
                    sx={{ marginRight: 2, width: 32, height: 32 }} // 깨끗한 외관을 위한 작은 아바타
                  />
                  <Box
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      borderRadius: "16px", // 둥근 모서리
                      padding: "8px 16px", // 일정한 패딩
                      maxWidth: "60%", // 메시지 너비 제한
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
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!isRecording}
                  onClick={() => handleBuy(currentProduct.id)} // 구매 버튼 클릭 시 handleBuy 호출
                  // onClick={handleCustomerClick}
                  sx={{ width: "60vw", height: "6vh" }}
                >
                  {isRecording ? "구매하기" : "상품 준비중"}
                </Button>
                /////////////////////////////////////////////얘다 달력 연결할 애임///////
              )}
            </Box>

            {/* <Box>{sttValue} </Box> */}
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
                sx={{ marginRight: 2, width: 32, height: 32 }} // 깨끗한 외관을 위한 작은 아바타
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
                  width: "80%", // 전체 width 설정
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

      {/* <CustomerDateTimeSelector
        open={open}
        handleClose={handleClose}
        place={place}
        live_date={liveDate}
        times={times}
      /> */}
    </div>
  );
};

export default OpenVideo;
