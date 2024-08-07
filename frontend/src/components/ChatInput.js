// ChatInput.js
import React, { useRef, useEffect, useState } from "react";
import inputStyles from "../styles/ChatInput.module.css";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { IconButton } from "@mui/material";
import ChatNav from "./ChatNav";
import CancelTrade from "./CancelTrade";
import ChatTradeDetail from "./ChatTradeDetail";

const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  setFocus,
  isChatNavOpen,
  setIsChatNavOpen,
}) => {
  const [isCancelTradeOpen, setIsCancelTradeOpen] = useState(false);
  const [isTradeDetailOpen, setIsTradeDetailOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("focus", () => {
        setFocus(true);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 300);
      });
      inputRef.current.addEventListener("blur", () => {
        setFocus(false);
      });
    }
  }, [setFocus]);

  const handlePlusIconClick = () => {
    setIsChatNavOpen(!isChatNavOpen);
  };

  const handleCancelTradeClick = () => {
    setIsChatNavOpen(false);
    setIsCancelTradeOpen(true);
  };

  const handleTradeDetailClick = () => {
    setIsChatNavOpen(false);
    setIsTradeDetailOpen(true);
  };

  return (
    <div
      className={`${inputStyles.chatInputContainer} ${
        isChatNavOpen ? inputStyles.blurBackground : ""
      }`}
    >
      <div className={inputStyles.plusIcon} onClick={handlePlusIconClick}>
        +
      </div>
      {isChatNavOpen && (
        <ChatNav
          onClose={() => setIsChatNavOpen(false)}
          onCancelTrade={handleCancelTradeClick}
          onTradeDetail={handleTradeDetailClick}
        />
      )}
      <CancelTrade
        isOpen={isCancelTradeOpen}
        onClose={() => setIsCancelTradeOpen(false)}
      />
      <ChatTradeDetail
        isOpen={isTradeDetailOpen}
        onClose={() => setIsTradeDetailOpen(false)}
      />
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
