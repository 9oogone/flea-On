import React from "react";
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

moment.locale("ko"); // 로케일 설정

const ChatPage = () => {
  const navigate = useNavigate();
  const chats = [
    {
      id: 1,
      thumbnail: "https://picsum.photos/100/100",
      isSeller: false,
      name: ["황토독", "마리아상", "등등"],
      last_chat: "안녕하세요",
      last_chat_time: "2024-08-03 21:11:22",
    },
    {
      id: 2,
      thumbnail: "https://picsum.photos/101/101",
      isSeller: true,
      name: ["상품 A", "상품 B"],
      last_chat: "상품 문의드립니다.",
      last_chat_time: "2024-08-03 20:15:10",
    },
    {
      id: 3,
      thumbnail: "https://picsum.photos/102/102",
      isSeller: false,
      name: ["상품 C"],
      last_chat: "오늘 거래 가능한가요?",
      last_chat_time: "2024-08-03 18:45:00",
    },
  ];

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
