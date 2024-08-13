import React, { useEffect, useState, useRef} from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import useDidMountEffect from "../utils/useDidMountEffect";
const ShortsPage = () => {
  const { shortsId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentShort = useSelector((state) => state.shorts.currentShort);
  const [comments, setComments] = useState([]);
  const [videoTime, setVideoTime] = useState(0);
  const [product, setProduct] = useState({});
  const [curChat, setCurChat] = useState(0);
  const [subList, setSubList] = useState([]);
  const videoRef = useRef(null);
  useDidMountEffect(() => {
    const fetchShortData = async () => {
      try {
        const response = await baseAxios().get(
          `/fleaon/shorts/play/${shortsId}`
        );
        dispatch(setCurrentShort(response.data));
        console.log(response.data)
        console.log(currentShort);
        setSubList(response.data.shortsChatResponseList);
        setComments(response.data.shortsChatResponseList);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching short data:", error);
      }
    };
    fetchShortData();
  }, [shortsId]);

  useEffect(() => {
    console.log(subList)
    const videoElement = videoRef.current;
    if (!videoElement) return
    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      if(curChat<subList.length && subList[curChat].time<=currentTime){
        console.log(curChat)
        setComments((prevList) => [...prevList, subList[curChat].content]);
        setCurChat(curChat+1);
      }
    };
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [comments]);

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
        muted
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
              mt: 2,
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              marginLeft: "-2%",
              paddingLeft: "4%",
              borderRadius: "10px",
              marginRight: "25%",
              mb: 3,
            }}
          >
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
            <Typography>{product.price}원</Typography>
          </Box>
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
