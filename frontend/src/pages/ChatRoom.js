import React, { useRef, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OpenVidu } from "openvidu-browser";
import { fetchChatRoom } from "../features/chat/chatroomSlice";
import styles from "../styles/ChatRoom.module.css";
import ChatInput from "../components/ChatInput";
import tailSent from "../assets/images/tail-sent.svg";
import tailReceived from "../assets/images/tail-received.svg";
import ProfileHeader from "../components/ProfileHeader";
import { getToken } from "../api/openViduAPI";
import useDidMountEffect from "../utils/useDidMountEffect";
import { setLoading, unSetLoading } from "../features/live/loadingSlice";
import { sendMessageDB, changeTradeTime } from "../features/chat/ChatApi";
import { Button } from "@mui/material";

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ChatRoom = () => {
  const location = useLocation();
  const chat = location.state;
  const { chatID } = useParams();
  const dispatch = useDispatch();
  const { chatRoom, status, error } = useSelector(
    (state) => state.chatRoom || {}
  );
  const userId = useSelector((state) => state.auth.user?.id);
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatNavOpen, setIsChatNavOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const isFocusedRef = useRef(false);
  const user = useSelector((state) => state.auth.user);
  const [isBuyer, setIsBuyer] = useState(false);
  let publisher;
  const session = useRef();

  useDidMountEffect(() => {
    console.log(chat);
    dispatch(setLoading());

    MakeSession(dispatch, chatID)
      .then((ss) => {
        console.log("MakeSession 성공");
        session.current = ss;
      })
      .catch((error) => {
        console.error("MakeSession 오류:", error);
        dispatch(unSetLoading());
      });

    return () => {
      console.log("closeSession");
      console.log(session.current);
      if (session.current) {
        if (publisher) {
          publisher = null;
        }
        session.current.disconnect();
      }
    };
  }, [chatID]);

  useEffect(() => {
    dispatch(fetchChatRoom(chatID)).then((data) => {
      console.log(data);
      setIsBuyer(data.payload.buyer);
      if (data.payload && data.payload.messageResponses) {
        const updatedMessages = data.payload.messageResponses.map((message) => {
          let isSent = message.writerId === user.userId;
          return {
            ...message,
            isSent: isSent,
            isSystemMessage: message.chatContent.startsWith("[System Message]")
          };
        });
        setMessageList(updatedMessages);
      }
    });
  }, [chatID, dispatch, userId]);

  const MakeSession = async (dispatch, chatID) => {
    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on("signal:chat", (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      if (type === 1) {
        const chatContent = data.message;
        const writerId = data.from;
        const isSent = data.from === user.userId;
        const chatTime = data.chatTime;
        const isSystemMessage = chatContent.startsWith("[System Message]");
        setMessageList((prevMessages) => [
          ...prevMessages,
          { chatContent, writerId, isSent, chatTime, isSystemMessage },
        ]);
      }
    });

    try {
      const resp = await getToken({ sessionName: "chat" + chatID });
      let token = resp[0];
      await session.connect(token, { clientData: "example" });
      return session;
    } catch (error) {
      console.error("세션 설정 중 오류 발생:", error);
      dispatch(unSetLoading());
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobile() && isFocusedRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // const handleSendMessage = () => {
  //   if (message.trim() !== '') {
  //     setMessages(prevMessages => {
  //       const updatedMessages = [...prevMessages, { text: message.replace(/\n/g, '<br/>'), isSent: true, time: formatTime(new Date()) }];
  //       return updatedMessages;
  //     });
  //     setMessage('');
  //     isFocusedRef.current = false;
  //   }
  // };


  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const sendMessage = () => {
    if (session.current && newMessage.trim() !== "") {
      const messageData = {
        message: newMessage,
        from: user.userId,
        profile: user.profilePicture,
        type: 1,
        chatTime: new Date().toISOString().slice(0, 19).replace("T", "T"),
      };
      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      sendMessageDB(chatID, newMessage);
      setNewMessage("");
    }
  };

  const handleAcceptTimeChange = async (messageId, newTime) => {
    const [tradeDate, tradeTime] = newTime.split(" "); // 날짜와 시간을 분리
    const message = `거래 시간 변경 수락: ${newTime}`;
    try {
      await changeTradeTime(chatID, tradeDate, tradeTime); // API 호출
      await sendMessageDB(chatID, message); // 메시지 저장
      setMessageList((prevMessages) => [
        ...prevMessages,
        {
          chatContent: message,
          writerId: user.userId,
          isSent: true,
          chatTime: new Date().toISOString(),
          isSystemMessage: true
        },
      ]);

      if (session.current) {
        session.current.signal({
          data: JSON.stringify({
            message: message,
            from: user.userId,
            type: 1,
            chatTime: new Date().toISOString(),
          }),
          type: "chat",
        });
      }
    } catch (error) {
      console.error("Error accepting time change:", error);
    }
  };

  const handleRejectTimeChange = async (messageId) => {
    const message = `[System Message] 거래 시간 변경 요청이 거절되었습니다.`;
    try {
      await sendMessageDB(chatID, message);
      setMessageList((prevMessages) => [
        ...prevMessages,
        {
          chatContent: message,
          writerId: user.userId,
          isSent: true,
          chatTime: new Date().toISOString(),
          isSystemMessage: true
        },
      ]);

      if (session.current) {
        session.current.signal({
          data: JSON.stringify({
            message: message,
            from: user.userId,
            type: 1,
            chatTime: new Date().toISOString(),
          }),
          type: "chat",
        });
      }
    } catch (error) {
      console.error("Error rejecting time change:", error);
    }
  };

  const shouldShowTime = (currentIndex, currentMessage) => {
    if (currentIndex === messageList.length - 1) return true;
    const nextMessage = messageList[currentIndex + 1];
    return (
      currentMessage.isSent !== nextMessage.isSent ||
      new Date(currentMessage.chatTime).toTimeString().slice(0, 5) !== new Date(nextMessage.chatTime).toTimeString().slice(0, 5)
    );
  }; // 같은 시간이면서 같은 사람이 보낸 메시지에는 마지막 메시지에만 시간이 나타나도록 함

  return (
    <div className={styles.chatRoom}>
      <ProfileHeader chat={chat} />
      <ul className={styles.messageList}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={
              msg.isSent
                ? styles.sentMessageContainer
                : styles.receivedMessageContainer
            }
          >
            <div
              className={
                msg.isSent ? styles.defaultbaloon : styles.receivedbaloon
              }
            >
              {msg.isSystemMessage ? (
                <div
                  className={`${styles.msg} ${styles.systemMessage}`}
                  dangerouslySetInnerHTML={{ __html: msg.chatContent }}
                />
              ) : (
                <div className={styles.msg}>{msg.chatContent}</div>
              )}
              {msg.chatContent.includes("거래 시간 변경 요청") && !msg.isSent && (
                <div className={styles.timeChangeButtons}>
                  <Button
                    onClick={() => handleAcceptTimeChange(msg.id, msg.chatContent)}
                  >
                    수락
                  </Button>
                  <Button onClick={() => handleRejectTimeChange(msg.id)}>
                    거절
                  </Button>
                </div>
              )}
              <img
                className={styles.tailIcon}
                alt=""
                src={msg.isSent ? tailSent : tailReceived}
              />
            </div>
            {shouldShowTime(index, msg) && (
              <div className={styles.time}>
                {new Date(msg.chatTime).toTimeString().slice(0, 5)}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <ChatInput
        chatID={chatID}
        message={newMessage}
        setMessage={setNewMessage}
        handleSendMessage={sendMessage}
        setFocus={(focus) => (isFocusedRef.current = focus)}
        isChatNavOpen={isChatNavOpen}
        isBuyer={isBuyer}
        setIsChatNavOpen={setIsChatNavOpen}
      />
    </div>
  );
};

export default ChatRoom;
