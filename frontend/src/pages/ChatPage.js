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
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats } from '../features/chat/chatSlice';

moment.locale("ko"); // 로케일 설정

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats, status, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChats());
    }
  }, [status, dispatch]);

  const formatChatTitle = (names) => {
    if (names.length > 1) {
      return `${names[0]} 외 ${names.length - 1}`;
    }
    return names[0];
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="left" marginLeft="10px" fontWeight="bold">
          채팅
        </Typography>
      </Box>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {status === 'failed' && <Typography>Error: {error}</Typography>}
      <List>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            onClick={() => handleChatClick(chat.id)}
          >
            <ListItemAvatar>
              <Avatar src={chat.thumbnail} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  <Typography variant="body1">
                    {formatChatTitle(chat.name)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      marginLeft: 1,
                      color: chat.isSeller ? "green" : "blue",
                    }}
                  >
                    {chat.isSeller ? "판매자" : "구매자"}
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
                    {chat.last_chat}
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
