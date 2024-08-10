import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCurrentShort } from "../features/shorts/shortsSlice";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
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
    dispatch(setCurrentShort(dummyData));
  }, [shortsId, dispatch]);

  if (!currentShort) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ m: 0, p: 0, position: "relative", height: "100vh" }}>
      <CustomVideoPlayer
        src={currentShort.url}
        loop
        autoPlay
        muted
        style={{ width: "100vw", height: "100vh", position: "fixed", top: 0 }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          p: 2,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">창고 대방출</Typography>
        <IconButton color="inherit" sx={{marginRight:"7%"}}>
          <ShareIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 2,
          color: "white",
          background: "rgba(0, 0, 0, 0)",
        }}
      >
        <div>
        <List sx={{ mt: 2 ,backgroundColor: "rgba(0, 0, 0, 0.25)", marginLeft:"-2%", paddingLeft:"4%", borderRadius:"10px", marginRight:"25%"}} >
          {currentShort.comments.map((comment) => (
            <ListItem key={comment.id} sx={{ p: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#333" }}>
                  {comment.username[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.username}
                secondary={comment.text}
                primaryTypographyProps={{ color: "white" }}
                secondaryTypographyProps={{ color: "white" }}
              />
            </ListItem>
          ))}
        </List>
        </div>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <Box>
    <Typography variant="h6">{currentShort.name}</Typography>
    <Typography>{currentShort.price}</Typography>
  </Box>
  <Button
    variant="contained"
    sx={{
      backgroundColor: "#FF0B55",
      color: "white",
      height: "50px",
      marginRight: "10%",
      width: "60%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "5%"
    }}
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
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <FavoriteIcon />
    <Typography>{currentShort.likes}</Typography>
  </Box>
</IconButton>

      </Box>
    </Container>
  );
};

export default ShortsPage;
