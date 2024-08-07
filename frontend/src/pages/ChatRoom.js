// ChatRoom.js
import { useRef, useEffect, useState, createElement } from 'react';
import { useParams } from 'react-router-dom';
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
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatNavOpen, setIsChatNavOpen] = useState(false); // Add this line
  const messagesEndRef = useRef(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    const dummyMessages = [
      { text: 'Hello, how are you?', isSent: false, time: formatTime(new Date()) },
      { text: 'I am good, thanks! How about you?', isSent: true, time: formatTime(new Date()) },
      { text: 'I am doing great!', isSent: false, time: formatTime(new Date()) },
      { text: 'That is good to hear.', isSent: true, time: formatTime(new Date()) },
    ];
    setMessages(dummyMessages);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, { text: message, isSent: true, time: formatTime(new Date()) }];
        return updatedMessages;
      });
      setMessage('');
      isFocusedRef.current = false;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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

  return createElement('div', { className: styles.chatRoom },
    createElement(ProfileHeader),
    createElement('ul', { className: styles.messageList },
      messages.map((msg, index) => 
        createElement('div', {
          key: index,
          className: msg.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer
        },
          createElement('div', { className: msg.isSent ? styles.defaultbaloon : styles.receivedbaloon },
            createElement('div', { className: styles.msg }, msg.text),
            createElement('img', { className: styles.tailIcon, alt: '', src: msg.isSent ? tailSent : tailReceived })
          ),
          shouldShowTime(index, msg) && createElement('div', { className: styles.time }, msg.time)
        )
      ),
      createElement('div', { ref: messagesEndRef })
    ),
    createElement(ChatInput, {
      message,
      setMessage,
      handleSendMessage,
      setFocus: (focus) => isFocusedRef.current = focus,
      isChatNavOpen, // Add this line
      setIsChatNavOpen // Add this line
    })
  );
};

export default ChatRoom;
