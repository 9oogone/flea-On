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
  const [isChatNavOpen, setIsChatNavOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    const dummyMessages = [
      { text: `안녕하세요 초호기 딸기왕님!<br/>
초합금 고라니의 마켓에 오신 것을 환영해요.<br/><br/>
✨ 거래 안내 <br/>
거래 시간 :  2024. 07. 23. 목요일 오후 3 시<br/>
거래 장소 :  대전광역시 유성구 동서대로 125<br/>
한밭대학교 주차장 1 <br/>
거래 상품 :  황토로 만든 커다란 독 외 3 개 상품<br/>
거래 금액 : ❤️무료나눔❤️<br/><br/>
거래 예정입니다!<br/>
늦지 않게 약속된 장소에서 만나요~`, isSent: false, time: formatTime(new Date()) },
      { text: 'I am good, thanks! How about you?', isSent: true, time: formatTime(new Date()) },
      { text: 'I am doing great!', isSent: false, time: formatTime(new Date()) },
      { text: 'That is good to hear.', isSent: true, time: formatTime(new Date()) },
      {
        text: '상품을 잘 받으셨나요? 구매하신 상품을 자랑해보세요!',
        isSent: false,
        time: formatTime(new Date()),
        button: { text: '채널 추가', onClick: () => alert('채널이 추가되었습니다.') }
      }
    ];
    setMessages(dummyMessages);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, { text: message.replace(/\n/g, '<br/>'), isSent: true, time: formatTime(new Date()) }];
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
      createElement('div', { ref: messagesEndRef })
    ),
    createElement(ChatInput, {
      message,
      setMessage,
      handleSendMessage,
      setFocus: (focus) => isFocusedRef.current = focus,
      isChatNavOpen,
      setIsChatNavOpen
    })
  );
};

export default ChatRoom;
