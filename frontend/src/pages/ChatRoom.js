import { useRef, useEffect, useState, createElement } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ChatRoom.module.css';
import ChatInput from '../components/ChatInput';
import tailSent from '../assets/images/tail-sent.svg';
import tailReceived from '../assets/images/tail-received.svg';

const ChatRoom = () => {
  const { chatID } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 더미 데이터 추가
    const dummyMessages = [
      { text: 'Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?', isSent: false },
      { text: 'I am good, thanks! How about you?', isSent: true },
      { text: 'I am doing great!', isSent: false },
      { text: 'That is good to hear.', isSent: true },
    ];
    setMessages(dummyMessages);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { text: message, isSent: true }]);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          )
        )
      ),
      createElement('div', { ref: messagesEndRef })
    ),
    createElement(ChatInput, {
      message,
      setMessage,
      handleSendMessage
    })
  );
};

export default ChatRoom;
