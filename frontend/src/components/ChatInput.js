import React from 'react';
import inputStyles from '../styles/ChatInput.module.css';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton } from '@mui/material';

const ChatInput = ({ message, setMessage, handleSendMessage }) => {
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
