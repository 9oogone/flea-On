import React from "react";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { chatId } = useParams();

  return (
    <div>
      <h1>Chat Room {chatId}</h1>
      {/* 여기에 채팅 내용을 표시하는 로직을 추가하세요 */}
    </div>
  );
};

export default ChatRoom;
