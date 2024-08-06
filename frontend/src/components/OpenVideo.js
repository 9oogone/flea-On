import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, unSetLoading } from "../features/live/loadingSlice";
import { getToken, startRecording, stopRecording } from "../api/openViduAPI";
import { useParams } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import Slider from "react-slick";
import baseAxios from "../utils/httpCommons";
import { createBrowserHistory } from "history";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDidMountEffect from "../utils/useDidMountEffect";

const OpenVideo = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isBuyButtonEnabled, setIsBuyButtonEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  //   const [session, setSession] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const dispatch = useDispatch();
  const { sessionName } = useParams();

  let publisher;
  let subscribers = [];

  const history = createBrowserHistory();
  const OV = useRef(new OpenVidu());
  const session = useRef();
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
    // return () => {
    //   console.log("test");
    //   if (session.current) {
    //     session.current.disconnect();
    //   }
    //   if (publisher) {
    //     publisher = null;
    //   }
    // };
  }, [sessionName]);
  //   const [locationKeys, setLocationKeys] = useState([]);

  //   useEffect(() => {
  //     return history.listen((location) => {
  //       if (history.action === "PUSH") {
  //         setLocationKeys([location.key]);
  //       }

  //       if (history.action === "POP") {
  //         if (locationKeys[1] === location.key) {
  //           setLocationKeys(([_, ...keys]) => keys);

  //           console.log("test");
  //           if (session.current) {
  //             session.current.disconnect();
  //           }
  //           if (publisher) {
  //             publisher = null;
  //           }
  //         } else {
  //           setLocationKeys((keys) => [location.key, ...keys]);

  //           console.log("test");
  //           if (session.current) {
  //             session.current.disconnect();
  //           }
  //           if (publisher) {
  //             publisher = null;
  //           }
  //         }
  //       }
  //     });
  //   }, [locationKeys, history]);

  const MakeSession = async (videoRef, dispatch, sessionName) => {
    const session = OV.current.initSession();

    session.on("streamCreated", (event) => {
      var subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
      subscriber.addVideoElement(videoRef.current);
    });

    session.on("signal:chat", (event) => {
      const message = event.data;
      const from = event.from.connectionId;
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    });

    try {
      const resp = await getToken({ sessionName: sessionName });
      let token = resp[0];
      await session.connect(token, { clientData: "example" });

      if (resp[1] === true) {
        setIsPublisher(true);
        publisher = OV.current.initPublisher(
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

  const fetchProductList = async (sessionName) => {
    try {
      //   const response = await baseAxios().get(
      //     `https://i11b202.p.ssafy.io/fleaOn/live/${sessionName}/detail`
      //   );
      //   const { products } = response.data;
      const products = [
        { name: "라면", price: 3000 },
        { name: "군것질", price: 2000 },
        { name: "쿠쿠다스", price: 4000 },
      ];
      setProductList(products);
      setCurrentProduct(products[0]); // 첫 번째 상품 설정
    } catch (error) {
      console.error("상품 목록 가져오기 오류:", error);
    }
  };

  const handleRecordStart = () => {
    if (session.current && currentProductIndex < productList.length) {
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
          setTimeout(() => {
            setIsBuyButtonEnabled(true);
          }, 5000);
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
      dispatch(setLoading());
      stopRecording({
        recording: session.current.sessionId,
      })
        .then(() => {
          setIsRecording(false);
          setIsBuyButtonEnabled(false);
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
    console.log("구매 처리 중...", productId);
    // 구매 처리를 위한 로직 추가
  };

  const sendMessage = () => {
    if (session.current && newMessage.trim() !== "") {
      session.current.signal({
        data: newMessage,
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
        <div style={{ width: "100vw", height: "100vh" }}>
          <video
            autoPlay={true}
            ref={videoRef}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          ></video>
        </div>
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.from}</strong>: {msg.message}
            </div>
          ))}
        </Box>
        <Box>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </Box>
        {isPublisher ? (
          <>
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
          </>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            disabled={!isBuyButtonEnabled}
            onClick={handleBuy}
            sx={{ width: "36vw" }}
          >
            {isRecording ? "구매하기" : "상품 준비중"}
          </Button>
        )}
        {currentProduct && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">현재 판매 중인 상품:</Typography>
            <Typography variant="subtitle1">{currentProduct.name}</Typography>
            <Typography variant="subtitle2">
              {currentProduct.description}
            </Typography>
            <Typography variant="body1">
              가격: {currentProduct.price}원
            </Typography>
          </Box>
        )}

        <Slider {...sliderSettings}>
          {isPublisher ? (
            <Box sx={{ padding: 2 }}>
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
            <Box sx={{ padding: 2 }}>
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
                      onClick={() => handleBuy(product.id)}
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
    </div>
  );
};

export default OpenVideo;
