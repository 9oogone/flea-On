import React from "react";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { chatID } = useParams();
const chatlog=[{name:""}]
  return (
    <div>
      <h1>Chat Room {chatID}</h1>
    </div>
  );
};

export default ChatRoom;
