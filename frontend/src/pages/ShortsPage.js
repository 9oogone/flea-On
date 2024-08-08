import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCurrentShort } from "../features/shorts/shortsSlice";
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
import CommentIcon from "@mui/icons-material/Comment";

const dummyVideoUrl =
  "https://videos.pexels.com/video-files/8549588/8549588-hd_1080_1920_25fps.mp4";

const dummyData = {
  id: "1",
  url: dummyVideoUrl,
  name: "자전거",
  price: "5만원",
  comments: [
    { id: 1, username: "cadetblue", text: "자전거 얼마나 쓰신 건가요" },
    { id: 2, username: "borami", text: "고장난 데는 없나요?" },
    { id: 3, username: "gimain", text: "멋진 자전거..." },
  ],
  likes: 8,
};

const ShortsPage = () => {
  const { shortsId } = useParams();
  const dispatch = useDispatch();
  const currentShort = useSelector((state) => state.shorts.currentShort);

  useEffect(() => {
    // 쇼츠 ID에 따라 더미 데이터를 설정
    dispatch(setCurrentShort(dummyData));
  }, [shortsId, dispatch]);

  if (!currentShort) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ m: 0, p: 0 }}>
      <video
        loop
        controls
        height="100%"
        src={currentShort.url}
        style={{ width: "100vw", height: "100vh", position: "fixed", top: 0 }}
        autoPlay
        muted
      >
        Your browser does not support the video tag.
      </video>
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          bottom: 0,
          width: "100%",
          color: "white",
          p: 2,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h5">{currentShort.name}</Typography>
        <Typography variant="h6">{currentShort.price}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 1 }}>
          구매하기
        </Button>
        <List sx={{ mt: 2 }}>
          {currentShort.comments.map((comment) => (
            <ListItem key={comment.id} sx={{ color: "white" }}>
              <ListItemAvatar>
                <Avatar>{comment.username[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.username}
                secondary={comment.text}
                sx={{ color: "white" }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <IconButton color="inherit">
            <FavoriteIcon /> {currentShort.likes}
          </IconButton>
          <IconButton color="inherit">
            <ShareIcon />
          </IconButton>
          <IconButton color="inherit">
            <CommentIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ShortsPage;
