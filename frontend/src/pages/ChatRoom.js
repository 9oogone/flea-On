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
import Filter from "badwords-ko";

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ChatRoom = () => {
  const filter = new Filter();
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
      console.log(11);
      console.log(data);
      if (data.payload && data.payload.messageResponses) {
        const updatedMessages = data.payload.messageResponses.map((message) => {
          let isSent = message.writerId === user.userId;
          return {
            ...message,
            isSent: isSent,
            isSystemMessage: message.chatContent.startsWith("[System Message]"),
            buttonsDisabled: false, // 버튼 비활성화 상태 추가
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
          {
            chatContent,
            writerId,
            isSent,
            chatTime,
            isSystemMessage,
            buttonsDisabled: false,
          },
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const sendMessage = () => {
    if (session.current && newMessage.trim() !== "") {
      const messageData = {
        message: filter.clean(newMessage),
        from: user.userId,
        profile: user.profilePicture,
        type: 1,
        chatTime: new Date().toISOString().slice(0, 19).replace("T", "T"),
      };

      session.current.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      sendMessageDB(chatID, filter.clean(newMessage));
      setNewMessage("");
    }
  };

  const handleAcceptTimeChange = async (messageId, newTime) => {
    console.log("이게 가:", newTime);

    // 희망 거래 시간만 추출
    const match = newTime.match(
      /(\d{2}월 \d{2}일 (오전|오후) \d{2}시 \d{2}분)/
    );
    const dateTimeString = match ? match[1] : null;
    
    function transformDateTime(dateTimeString) {
      if (!dateTimeString) {
        console.error("dateTimeString is null or undefined");
        return { tradeDate: null, tradeTime: null };
      }

      const datePart = dateTimeString.match(/\d{2}월 \d{2}일/)[0];
      const period = dateTimeString.match(/오전|오후/)[0];
      const timePart = dateTimeString.match(/\d{2}시 \d{2}분/)[0];

      const [month, day] = datePart
        .split("월 ")
        .map((part) => part.replace("일", "").trim());
      let [hour, minute] = timePart
        .split("시 ")
        .map((part) => part.replace("분", "").trim());

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth() returns 0-based month

      let year = currentYear;
      if (parseInt(month, 10) < currentMonth) {
        year += 1; // Next year if the month is earlier than the current month
      }

      hour = parseInt(hour, 10);
      if (period === "오후" && hour !== 12) {
        hour += 12; // Convert PM to 24-hour format
      } else if (period === "오전" && hour === 12) {
        hour = 0; // Midnight case
      }

      const tradeDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      const tradeTime = `${hour.toString().padStart(2, "0")}:${minute.padStart(
        2,
        "0"
      )}`;

      return { tradeDate, tradeTime };
    }

    const { tradeDate, tradeTime } = transformDateTime(dateTimeString);

    console.log("tradeDate:", tradeDate); // Output: tradeDate: 2023-12-24 or 2024-12-24 depending on current date
    console.log("tradeTime:", tradeTime); // Output: tradeTime: 21:24

    const message = `[System Message]<br/>
    거래 시간이 변경되었습니다.<br/>
    ${dateTimeString}에 만나요!`;

    try {
      await changeTradeTime(chatID, tradeDate, tradeTime);

      const newSystemMessage = {
        chatContent: message,
        writerId: user.userId,
        isSent: true,
        chatTime: new Date().toISOString(),
        isSystemMessage: true,
      };

      // 상태를 즉시 업데이트하여 화면에 반영
      setMessageList((prevMessages) => [...prevMessages, newSystemMessage]);

      await sendMessageDB(chatID, message);

      setMessageList((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, buttonsDisabled: true } : msg
        )
      );

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
    const message = `[System Message]<br/>
    거래 시간 변경이 거절되었습니다.`;

    try {
      const newSystemMessage = {
        chatContent: message,
        writerId: user.userId,
        isSent: true,
        chatTime: new Date().toISOString(),
        isSystemMessage: true,
      };

      // 상태를 즉시 업데이트하여 화면에 반영
      setMessageList((prevMessages) => [...prevMessages, newSystemMessage]);

      await sendMessageDB(chatID, message);

      setMessageList((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, buttonsDisabled: true } : msg
        )
      );

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
      new Date(currentMessage.chatTime).toTimeString().slice(0, 5) !==
        new Date(nextMessage.chatTime).toTimeString().slice(0, 5)
    );
  };

  const getDisplayContent = (message) => {
    if (message.isSystemMessage) {
      return message.chatContent.replace("[System Message]<br/>", "");
    }
    return message.chatContent;
  };

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
                msg.isSystemMessage
                  ? styles.systemMessageBaloon
                  : msg.isSent
                  ? styles.defaultbaloon
                  : styles.receivedbaloon
              }
            >
              {msg.isSystemMessage ? (
                <div
                  className={`${styles.msg} ${styles.systemMessage}`}
                  dangerouslySetInnerHTML={{ __html: getDisplayContent(msg) }}
                />
              ) : (
                <div className={styles.msg}>{msg.chatContent}</div>
              )}
              {msg.chatContent.includes("거래 시간 변경 요청") &&
                !msg.isSent &&
                !msg.buttonsDisabled && (
                  <div className={styles.timeChangeButtons}>
                    <Button
                      onClick={() =>
                        handleAcceptTimeChange(msg.id, msg.chatContent)
                      }
                    >
                      수락
                    </Button>
                    <Button onClick={() => handleRejectTimeChange(msg.id)}>
                      거절
                    </Button>
                  </div>
                )}
              {!msg.isSystemMessage && (
                <img
                  className={styles.tailIcon}
                  alt=""
                  src={msg.isSent ? tailSent : tailReceived}
                />
              )}
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
        isBuyer={chat.buyer}
        setIsChatNavOpen={setIsChatNavOpen}
      />
    </div>
  );
};

export default ChatRoom;
