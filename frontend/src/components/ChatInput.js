import React, { useRef, useEffect } from 'react';
import inputStyles from '../styles/ChatInput.module.css';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton } from '@mui/material';

const ChatInput = ({ message, setMessage, handleSendMessage, setFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', () => {
        setFocus(true);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 300);
      });
      inputRef.current.addEventListener('blur', () => {
        setFocus(false);
      });
    }
  }, [setFocus]);

  return (
    <div className={inputStyles.chatInputContainer}>
      <div className={inputStyles.plusIcon}>+</div>
      <div className={inputStyles.inputWrapper}>
        <input
          className={inputStyles.inputField}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="메시지 보내기"
          ref={inputRef}
        />
        <IconButton
          className={inputStyles.sendButton}
          onClick={handleSendMessage}
        >
          <ArrowCircleRightIcon className={inputStyles.sendIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatInput;
