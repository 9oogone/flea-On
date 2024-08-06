import { useRef, useEffect, useState, createElement } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ChatRoom.module.css';
import ChatInput from '../components/ChatInput';
import tailSent from '../assets/images/tail-sent.svg';
import tailReceived from '../assets/images/tail-received.svg';

// 사용자 정의 함수로 모바일 환경 감지
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

// 현재 시간을 hh:mm 포맷으로 반환하는 함수
const formatTime = date => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const ChatRoom = () => {
  const { chatID } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    // 더미 데이터 추가
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
      isFocusedRef.current = false; // 메시지 전송 후 포커스 상태 리셋
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
    if (currentIndex === messages.length - 1) return true; // 마지막 메시지에는 항상 시간을 표시
    const nextMessage = messages[currentIndex + 1];
    // 다른 타입의 메시지이거나 시간이 다른 경우 시간을 표시
    return currentMessage.isSent !== nextMessage.isSent || currentMessage.time !== nextMessage.time;
  };

  return createElement('div', { className: styles.chatRoom },
    createElement('h1', null, `Chat Room ${chatID}`),
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
          shouldShowTime(index, msg) && createElement('div', { className: styles.time }, msg.time) // 조건에 따라 시간 표시
        )
      ),
      createElement('div', { ref: messagesEndRef })
    ),
    createElement(ChatInput, {
      message,
      setMessage,
      handleSendMessage,
      setFocus: (focus) => isFocusedRef.current = focus
    })
  );
};

export default ChatRoom;
