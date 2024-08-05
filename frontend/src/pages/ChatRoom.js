import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, List, ListItem } from '@mui/material';
import styles from '../styles/ChatRoom.module.css';

const ChatRoom = () => {
  const { chatID } = useParams();
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return React.createElement(
    Box,
    { className: styles.chatRoom },
    React.createElement('h1', null, `Chat Room ${chatID}`),
    React.createElement(
      List,
      { className: styles.messageList },
      ...messages.map((msg, index) =>
        React.createElement(ListItem, { key: index }, msg)
      ),
      React.createElement('div', { ref: messagesEndRef })
    ),
    React.createElement(
      Box,
      { className: styles.inputContainer, display: 'flex' },
      React.createElement(TextField, {
        className: styles.textField,
        value: message,
        onChange: (e) => setMessage(e.target.value),
        onKeyPress: handleKeyPress,
        variant: 'outlined',
        fullWidth: true
      }),
      React.createElement(
        Button,
        { className: styles.sendButton, onClick: handleSendMessage, variant: 'contained' },
        'Send'
      )
    )
  );
};

export default ChatRoom;
