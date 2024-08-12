import React, { useEffect } from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일을 사용합니다
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../features/chat/chatSlice";

moment.locale("ko"); // 로케일 설정

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats, status, error, noChats } = useSelector((state) => state.chat);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChats());
    }
    console.log(chats);
  }, [status, dispatch]);

  const formatChatTitle = (chat) => {
    // if (names.length > 1) {
    //   return `${names[0]} 외 ${names.length - 1}`;
    // }
    return chat.userNickName;
  };

  const handleChatClick = (chat) => {
    console.log(chat);
    navigate(`/chat/${chat.chattingId}`, { state: chat });
  };

  return (
    <Container>
      <Box my={4}>
        <Typography
          variant="h4"
          align="left"
          marginLeft="10px"
          fontWeight="bold"
        >
          채팅
        </Typography>
      </Box>
      {status === "loading" && <Typography>Loading...</Typography>}
      {status === "failed" && <Typography>Error: {error}</Typography>}
      {status === "succeeded" && noChats && (
        <Typography>채팅방이 없습니다.</Typography>
      )}
      <List>
        {chats.map((chat, index) => (
          <ListItem
            key={chat.id || index}
            button
            onClick={() => handleChatClick(chat)}
          >
            <ListItemAvatar>
              <Avatar src={chat.profile} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  <Typography variant="body1">
                    {formatChatTitle(chat)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      marginLeft: 1,
                      color: chat.isBuyer ? "green" : "blue",
                    }}
                  >
                    {chat.isBuyer ? "구매자" : "판매자"}
                  </Typography>
                </Box>
              }
              secondary={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {chat.recentMessage}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    {moment(chat.last_chat_time).fromNow()}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ChatPage;
