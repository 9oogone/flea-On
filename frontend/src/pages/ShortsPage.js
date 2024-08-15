import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { setCurrentShort } from "../features/shorts/shortsSlice";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import baseAxios from "../utils/httpCommons";
import { useSwipeable } from "react-swipeable";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import useDidMountEffect from "../utils/useDidMountEffect";
import { formatPrice } from "../utils/cssUtils";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const ShortsPage = () => {
  const location = useLocation();
  const dir = location.state;
  const { shortsId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authId = useSelector((state) => state.auth.user?.userId);
  const currentShort = useSelector((state) => state.shorts.currentShort);
  console.log("로그인한 사용자 입니다.", authId);
  const [userId, setUserId] = useState(0);
  console.log("숏츠 판매자 입니다.", userId);
  const [comments, setComments] = useState([]);
  const [videoTime, setVideoTime] = useState(0);
  const [product, setProduct] = useState({});
  const [curChat, setCurChat] = useState(0);
  const [subList, setSubList] = useState([]);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [tradeNow, setTradeNow] = useState(true);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [shortList, setAShortLIst] = useState([]);

  const videoRef = useRef(null);
  useDidMountEffect(() => {
    const fetchShortData = async () => {
      try {
        const response = await baseAxios().get(
          `/fleaon/shorts/play/${shortsId}`
        );
        dispatch(setCurrentShort(response.data));
        console.log(response.data);
        console.log(response);
        console.log(currentShort);
        setUserId(response.data.user.userId);
        setSubList(response.data.shortsChatResponseList);
        // setComments(response.data.shortsChatResponseList);
        setProduct(response.data.product);
        setTradeNow(response.data.tradeNow);
      } catch (error) {
        console.error("Error fetching short data:", error);
      }
    };
    fetchShortData();
  }, [shortsId]);
  useEffect(() => {
    console.log(subList);
    console.log(comments);
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const handleTimeUpdate = () => {
      if (videoElement.currentTime < 0.1 && curChat !== 0) {
        setCurChat(0);
        setComments([]);
      }

      const currentTime = videoElement.currentTime;
      if (curChat < subList.length && subList[curChat].time <= currentTime) {
        console.log(curChat);
        setComments((prevList) => [...prevList, subList[curChat]]);
        setCurChat(curChat + 1);
      }
    };
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [comments, subList]);

  const handleTimeUpdate = (event) => {
    setVideoTime(event.target.currentTime);
  };

  // const filteredComments = comments.filter((comment) => {
  //   const commentTime = parseFloat(comment.time);
  //   return commentTime <= videoTime;
  // });

  const handleSwipe = async (eventData) => {
    const res = await baseAxios().get("fleaon/shorts/random");
    navigate(`/shorts/${res.data}`, {
      state: { dir: eventData.dir },
      replace: true,
    });
  };
  const handlers = useSwipeable({
    onSwipedUp: handleSwipe,
    onSwipedDown: handleSwipe,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // 끌어올리기 모달
  const handelBoostShorts = () => {
    const calculatedDiscountedPrice = Math.floor(product.price * 0.9);
    setDiscountedPrice(calculatedDiscountedPrice);
    setIsBoostModalOpen(true);
  };

  const handleCloseBoostModal = () => {
    setIsBoostModalOpen(false);
  };

  const handleConfirmBoost = async () => {
    setIsBoostModalOpen(false);
    if (product.productId) {
      console.log(product.pro);
      try {
        // 프론트에서 10% 할인된 가격을 먼저 계산
        const response = await baseAxios().put(
          `/fleaon/purchase/reUpload?productId=${product.productId}`
        );
        const discountedPrice = (product.price * 0.9) | 0;

        // 할인된 가격을 프론트에서 먼저 반영
        setProduct((prevProduct) => ({
          ...prevProduct,
          price: discountedPrice,
        }));
        console.log("끌어올리기 성공:", response.data);
      } catch (error) {
        console.error("끌어올리기 실패:", error);
      }
    }
  };

  if (!currentShort) return <Typography>Loading...</Typography>;

  return (
    <Container
      {...handlers}
      sx={{
        m: 0,
        p: 0,
        position: "relative",
        height: "100vh",
      }}
    >
      <CustomVideoPlayer
        src={currentShort.videoAddress}
        videoRef={videoRef}
        loop
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        style={{
          backgroundColor: "green",
          width: "100%",
          height: "100vh",
          position: "fixed",
          top: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "90%",
          p: 2,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            width: "100%",
          }}
        >
          {currentShort.liveTitle}
        </Typography>
        <IconButton
          color="inherit"
          sx={{
            p: 0,
            marginRight: "0",
            width: "10%",
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "90%",
          p: 2,
          color: "white",
          background: "rgba(0, 0, 0, 0)",
        }}
      >
        <div>
          <List
            sx={{
              height: "200px",
              mt: 2,
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              marginLeft: "-2%",
              paddingLeft: "4%",
              borderRadius: "10px",
              marginRight: "25%",
              mb: 3,
              overflow: "scroll",
            }}
          >
            <div style={{ margin: "3%" }}>채팅 다시보기</div>
            {comments.map((comment) => (
              <ListItem key={comment.time} sx={{ p: 0 }}>
                <ListItemAvatar>
                  <Avatar src={comment.profilePic} />
                </ListItemAvatar>
                <ListItemText
                  primary={comment.nickName}
                  secondary={comment.content}
                  primaryTypographyProps={{ color: "white" }}
                  secondaryTypographyProps={{ color: "white" }}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Typography variant="h6">{product.name}</Typography>
            <Typography>{formatPrice(product.price)}</Typography>
          </Box>
          {authId && authId !== userId ? (
            <Button
              variant="contained"
              sx={{
                height: "50px",
                width: "60%",
              }}
              color="secondary"
              onClick={handelBoostShorts}
            >
              구매하기
            </Button>
          ) : tradeNow ? (
            <Button
              variant="contained"
              sx={{
                height: "50px",
                width: "60%",
              }}
              color="secondary"
            >
              거래 중인 상품
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                height: "50px",
                width: "60%",
              }}
              color="secondary"
              onClick={handelBoostShorts}
            >
              끌어올리기
            </Button>
          )}
          {/* 거래 확정 다이얼로그 */}
          <Dialog
            open={isBoostModalOpen}
            onClose={handleCloseBoostModal}
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
              쇼츠 끌어올리기
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
                이 상품을 끌어올리시겠습니까?
              </Typography>
              {discountedPrice !== 0 && (
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
                  할인 예정 가격: {formatPrice(discountedPrice)}
                </Typography>
              )}
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "#777",
                }}
              >
                (끌어올리기를 하면 상품이 목록의 상단으로 이동하며, 10% 비율로
                가격이 할인됩니다.)
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#777",
                }}
              >
                ♥무료나눔은 언제든 끌올 가능♥
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Button
                onClick={handleCloseBoostModal}
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
                onClick={handleConfirmBoost}
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
                끌어올리기
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: "15%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <IconButton color="inherit">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FavoriteIcon />
            <Typography>{currentShort.likes}</Typography>
          </Box>
        </IconButton>
      </Box>
    </Container>
  );
};

export default ShortsPage;
