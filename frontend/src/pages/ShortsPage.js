import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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

const ShortsPage = () => {
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

  const videoRef = useRef(null);
  useDidMountEffect(() => {
    const fetchShortData = async () => {
      try {
        const response = await baseAxios().get(
          `/fleaon/shorts/play/${shortsId}`
        );
        dispatch(setCurrentShort(response.data));
        console.log(response.data);
        console.log(currentShort);
        setUserId(response.data.user.userId);
        setSubList(response.data.shortsChatResponseList);
        // setComments(response.data.shortsChatResponseList);
        setProduct(response.data.product);
        setTradeNow();
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

  const handleSwipe = (eventData) => {
    if (eventData.dir === "Up") {
      // 다음 비디오로 이동
      const nextShortId = parseInt(shortsId) + 1;
      navigate(`/shorts/${nextShortId}`);
    } else if (eventData.dir === "Down") {
      // 이전 비디오로 이동
      const prevShortId = parseInt(shortsId) - 1;
      if (prevShortId > 0) {
        navigate(`/shorts/${prevShortId}`);
      }
    }
  };
  const handlers = useSwipeable({
    onSwipedUp: handleSwipe,
    onSwipedDown: handleSwipe,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // useDidMountEffect(() => {
  //   const handleBoostProduct = async (productId) => {
  //     try {
  //       const response = await baseAxios().put(`/fleaon/purchase/reUpload`, {
  //         params: { productId: productId },
  //       });
  //       console.log("끌어올리기 성공:", response.data);
  //       return response.data;
  //     } catch (error) {
  //       console.error("끌어올리기 실패:", error);
  //     }
  //   };
  //   if (product.productId) {
  //     handleBoostProduct(product.productId);
  //   }
  // }, [product.productId]);

  // 끌어올리기 모달
  const handelBoostShorts = () => {
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
        const response = await baseAxios().put(
          `/fleaon/purchase/reUpload?productId=${product.productId}`
        );
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
            >
              구매하기
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
          <Dialog open={isBoostModalOpen} onClose={handleCloseBoostModal}>
            <DialogTitle>상품 끌어올리기</DialogTitle>
            <DialogContent>
              <Typography>이 상품을 끌어올리시겠습니까?</Typography>
              <Typography sx={{ fontSize: 12, mt: 1 }}>
                (끌어올리기를 하면 상품이 목록의 상단으로 이동하며, 10% 비율로
                가격이 할인됩니다.)
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmBoost} color="primary">
                끌어올리기
              </Button>
              <Button onClick={handleCloseBoostModal}>취소</Button>
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
