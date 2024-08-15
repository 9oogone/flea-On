import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Modal
} from "@mui/material";
import { truncateText } from "../utils/truncateText";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일을 사용합니다
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../features/chat/chatSlice";
import warningIcon from '../assets/images/warning.svg';

moment.locale("ko"); // 로케일 설정

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [liveId, setLiveId] = useState();
  const { chats, status, error, noChats } = useSelector((state) => state.chat);

  useEffect(() => {
    fetchChats()
    const intervalId = setInterval(() => {
        dispatch(fetchChats());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [status, dispatch]);

  const toggleLiveModal = (liveId) => {
    setLiveId(liveId)
    setLiveModalOpen(prevState => !prevState);
  };

  const formatChatTitle = (chat) => {
    // if (names.length > 1) {
    //   return `${names[0]} 외 ${names.length - 1}`;
    // }
    return chat.userNickName;
  };

  const handleChatClick = (chat) => {
    if(chat.isLive==1){
      toggleLiveModal(chat.liveId)
      // navigate(`/live/${chat.liveId}`)
    }else{
    console.log(chat);
    navigate(`/chat/${chat.chattingId}`, { state: chat });
  }
  };

  return (
    <Container>
      <Modal
        open={liveModalOpen}
        onClose={toggleLiveModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            border: '1px solid lightGray',
          }}
        >
          <Typography id="modal-header" variant="h3" component="div">
            <img src={warningIcon} alt="" />
          </Typography>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2, color: '#777' }}>
            현재 방송중인 채팅방입니다
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3, width: '100%', backgroundColor:"#FF0B55"}} 
            onClick={()=>navigate(`/live/${liveId}`)}
          >
            방송으로 이동하기
          </Button>
        </Box>
      </Modal>
      <Box my={4}>
        <Typography
          variant="h4"
          align="left"
          marginLeft="10px"
          fontWeight="bold"
          sx={{
            letterSpacing: '-0.5px',
            color: "#2E2E32"
          }}
        >
          Chat
        </Typography>
      </Box>
      {/* {status === 'loading' && <Typography>Loading...</Typography>} */}
      {status === 'failed' && <Typography>Error: {error}</Typography>}
      {status === 'succeeded' && noChats && <Typography>채팅방이 없습니다.</Typography>}
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
                      color: chat.isLive==1? 'red' : chat.buyer ? "green" : "blue",
                    }}
                  >
                    {chat.isLive==1? "방송중" : chat.buyer ? "구매자" : "판매자"}
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
                    {chat.recentMessage.startsWith("[System Message]")?"시스템 메세지":truncateText(chat.recentMessage,30)}
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
