import React, { useEffect, useRef, useState, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, unSetLoading } from "../features/live/loadingSlice";
import { getToken, startRecording, stopRecording } from "../api/openViduAPI";
import { useParams } from "react-router-dom";
import { Button, Box, Typography, Modal, TextField } from "@mui/material";
import Slider from "react-slick";
import baseAxios from "../utils/httpCommons";
import { useSpeechRecognition } from "react-speech-kit";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDidMountEffect from "../utils/useDidMountEffect";
import Calendar from "../components/SelectTradeTime"; // SelectTradeTime 컴포넌트를 불러옵니다.
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import { styled } from "@mui/system";
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { from, message, profile, userId },
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

  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          if (session) {
            await session.unpublish(mainStreamManager);
            await session.publish(newPublisher);
            setCurrentVideoDevice(newVideoDevice[0]);
            setMainStreamManager(newPublisher);
            setPublisher(newPublisher);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentVideoDevice, session, mainStreamManager]);

  const fetchProductList = async (sessionName) => {
    try {
      // const response = await baseAxios().get(
      //   `https://i11b202.p.ssafy.io/fleaOn/live/${sessionName}/detail`
      // );
      // const { products } = response.data;

      const products = [
        { id: 1, name: "라면", price: 3000 },
        { id: 2, name: "군것질", price: 2000 },
        { id: 3, name: "쿠쿠다스", price: 4000 },
      ];
      setProductList(products);
      setCurrentProduct(products[0]); // 첫 번째 상품 설정
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
        outputMode: "COMPOSED",
        hasAudio: true,
        hasVideo: true,
      })
        .then(() => {
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
        recording: session.current.sessionId,
      })
        .then(() => {
          setIsRecording(false);
          dispatch(unSetLoading());
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
      };

      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setNewMessage("");
    }
  };

  const endBroadcast = () => {
    console.log("방송 종료");
    // 방송 종료를 위한 로직 추가
  };

  const sliderSettings = {
    dots: false,
    infinite: false, // 무한 루프를 끕니다.
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
    <div style={{ padding: "-8px" }}>
      {isPublisher ? (
        <div>
          <video
            autoPlay={true}
            ref={videoRef}
            style={{
              objectFit: "cover",
              width: "100vw",
              height: "100vh",
              position: "fixed",
              zIndex: "-1",
            }}
          ></video>
        </div>
      ) : (
        <div style={{ padding: "-8px" }}>
          <video
            autoPlay={true}
            ref={videoRef}
            style={{
              objectFit: "cover",
              width: "100vw",
              height: "100vh",
              position: "fixed",
              zIndex: "-1",
            }}
          ></video>
        </div>
      )}
      <Box>
        <Slider {...sliderSettings}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button>
              <CloseIcon />
            </Button>
            <Box
              ref={messagesContainerRef}
              sx={{
                height: 200, // 메시지 목록의 최대 높이를 설정합니다.
                overflowY: "auto", // 세로 스크롤이 가능하게 합니다.
                position: "relative", // 흐림 효과를 위한 상대 위치 설정
                padding: 1, // 메시지 목록의 패딩
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 20, // 흐림 효과의 높이
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))", // 흐림 효과
                  zIndex: 1,
                }}
              />
              {messages.map((msg, index) =>
                msg.userId === user.userId ? (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginBottom: 1,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: 2,
                        padding: 1,
                      }}
                    >
                      {msg.from}: {msg.message}
                    </Box>
                    <Avatar
                      src={msg.profile}
                      alt={msg.from}
                      sx={{ marginLeft: 1 }}
                    />
                  </Box>
                ) : (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginBottom: 1,
                    }}
                  >
                    <Avatar
                      src={msg.profile}
                      alt={msg.from}
                      sx={{ marginRight: 1 }}
                    />
                    <Box
                      sx={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: 2,
                        padding: 1,
                        color: "white",
                      }}
                    >
                      {msg.from}: {msg.message}
                    </Box>
                  </Box>
                )
              )}
            </Box>
            <Box>
              <TextField
                type="text"
                color="google"
                value={newMessage}
                sx={{ color: "white" }}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>
                <SendIcon color="google" />
              </Button>
            </Box>
            {isPublisher ? (
              <Box>
                {currentProductIndex < productList.length ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={isRecording ? handleRecordStop : handleRecordStart}
                    sx={{ width: "36vw" }}
                  >
                    {isRecording ? "다음 상품 준비" : "판매시작"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={endBroadcast}
                    sx={{ width: "36vw" }}
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
                sx={{ width: "36vw" }}
              >
                {isRecording ? "구매하기" : "상품 준비중"}
              </Button>
            )}
            {currentProduct && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">현재 판매 중인 상품:</Typography>
                <Typography variant="subtitle1">
                  {currentProduct.name}
                </Typography>

                <Typography variant="body1">
                  가격: {currentProduct.price}원
                </Typography>
              </Box>
            )}
            <Button
              id="buttonSwitchCamera"
              onClick={switchCamera}
              value="Switch Camera"
            >
              <FlipCameraAndroidIcon color="google" />
            </Button>
            <Box>{sttValue} </Box>
          </Box>
          {isPublisher ? (
            <Box>
              <Typography variant="h6">
                판매자 - 다음에 판매할 상품 목록
              </Typography>
              {productList
                .slice(currentProductIndex + 1)
                .map((product, index) => (
                  <Box
                    key={index + currentProductIndex + 1}
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Typography variant="body1">
                      가격: {product.price}원
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handlePrepareProduct(index + currentProductIndex + 1)
                      }
                      sx={{ width: "36vw" }}
                    >
                      이 상품 준비하기
                    </Button>
                  </Box>
                ))}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">구매자 - 지나간 상품 목록</Typography>
              {productList
                .slice(0, currentProductIndex)
                .map((product, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Typography variant="body1">
                      가격: {product.price}원
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuy(product.id)} // 지나간 상품에 대해서도 구매 버튼 클릭 시 handleBuy 호출
                      sx={{ width: "36vw" }}
                    >
                      구매하기
                    </Button>
                  </Box>
                ))}
            </Box>
          )}
        </Slider>
      </Box>

      {/* MUI Modal 컴포넌트 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Calendar
            productId={selectedProductId}
            onClose={() => setIsModalOpen(false)}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default OpenVideo;
