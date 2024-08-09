import { useRef, useEffect, useState, createElement } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRoom } from '../features/chat/chatroomSlice'; 
import styles from '../styles/ChatRoom.module.css';
import ChatInput from '../components/ChatInput';
import tailSent from '../assets/images/tail-sent.svg';
import tailReceived from '../assets/images/tail-received.svg';
import ProfileHeader from '../components/ProfileHeader';

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

const formatTime = date => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const ChatRoom = () => {
  const { chatID } = useParams();
  const dispatch = useDispatch();
  const { chatRoom, status, error } = useSelector((state) => state.chatRoom);
  const userId = useSelector((state) => state.auth.user?.id); 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatNavOpen, setIsChatNavOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchChatRoom(chatID));
  }, [chatID, dispatch]);

  useEffect(() => {
    if (chatRoom && chatRoom.messages) {
      const formattedMessages = chatRoom.messages.map(msg => ({
        text: msg.chat_content,
        isSent: msg.writer_id === userId,
        time: formatTime(new Date(msg.chat_time)),
      }));
      setMessages(formattedMessages);
    }
  }, [chatRoom, userId]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobile() && isFocusedRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldShowTime = (currentIndex, currentMessage) => {
    if (currentIndex === messages.length - 1) return true;
    const nextMessage = messages[currentIndex + 1];
    return currentMessage.isSent !== nextMessage.isSent || currentMessage.time !== nextMessage.time;
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const isSeller = chatRoom?.seller_id === userId;
  const isBuyer = chatRoom?.buyer_id === userId;

  return createElement('div', { className: styles.chatRoom },
    createElement(ProfileHeader),
    createElement('ul', { className: styles.messageList },
      messages.map((msg, index) => 
        createElement('div', {
          key: index,
          className: msg.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer
        },
          createElement('div', { className: msg.isSent ? styles.defaultbaloon : styles.receivedbaloon },
            createElement('div', { className: styles.msg, dangerouslySetInnerHTML: { __html: msg.text } }),
            msg.button && createElement('button', {
              className: styles.messageButton,
              onClick: msg.button.onClick
            }, msg.button.text),
            createElement('img', { className: styles.tailIcon, alt: '', src: msg.isSent ? tailSent : tailReceived })
          ),
          shouldShowTime(index, msg) && createElement('div', { className: styles.time }, msg.time)
        )
      ),
      React.createElement("div", { ref: messagesEndRef })
    ),
    createElement(ChatInput, {
      message,
      setMessage,
      handleSendMessage,
      setFocus: (focus) => isFocusedRef.current = focus,
      isChatNavOpen,
      setIsChatNavOpen,
      isSeller, 
      isBuyer   
    })
  );
};

export default ChatRoom;
