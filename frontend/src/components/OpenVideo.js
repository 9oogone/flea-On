// src/components/OpenVideo.js
import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, unSetLoading } from "../features/live/loadingSlice";
import { getToken, startRecording, stopRecording } from "../api/openViduAPI";
import { useParams } from "react-router-dom";
import useDidMountEffect from "../utils/useDidMountEffect";
import { setSession, clearSession } from "../features/live/sessionSlice";

const OpenVideo = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const { sessionName } = useParams();
  let publisher;
  let subscribers = [];

  useDidMountEffect(() => {
    dispatch(setLoading());

    MakeSession(videoRef, dispatch, sessionName)
      .then((session) => {
        console.log("MakeSession 성공");
        dispatch(setSession(session));
      })
      .catch((error) => {
        console.error("MakeSession 오류:", error);
        dispatch(unSetLoading());
      });

    return () => {
      console.log(session);
      if (session) {
        if (publisher) {
          publisher = null;
        }
        session.disconnect();
        dispatch(clearSession());
      }
    };
  }, [sessionName]);

  const MakeSession = async (videoRef, dispatch, sessionName) => {
    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on("streamCreated", (event) => {
      var subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
      // console.log("subscriber")
      // console.log(subs)
      // subs = subscriber;
      // console.log(subs)
      // subs.addVideoElement(videoRef.current);
      console.log(subscriber);
      subscriber.addVideoElement(videoRef.current);
    });

    session.on("signal:chat", (event) => {
      const message = event.data;
      const from = event.from.connectionId;
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    });
    try {
      const resp = await getToken({ sessionName: sessionName });
      console.log(resp);
      let token = resp[0];
      await session.connect(token, { clientData: "example" });
      if (resp[1] === true) {
        setIsPublisher(true);
        publisher = OV.initPublisher(
          undefined,
          {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "405x1080",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          },
          () => {
            publisher.addVideoElement(videoRef.current);
            session.publish(publisher);
            dispatch(unSetLoading());
          },
          (error) => {
            console.error(error);
            dispatch(unSetLoading());
          }
        );
      }
      return session;
    } catch (error) {
      console.error("세션 설정 중 오류 발생:", error);
      dispatch(unSetLoading());
    }
  };

  const handleRecordStart = () => {
    if (session) {
      dispatch(setLoading());
      console.log(session.sessionId);
      startRecording({
        session: session.sessionId,
        outputMode: "COMPOSED",
        hasAudio: true,
        hasVideo: true,
      })
        .then((resp) => {
          setIsRecording(true);
          dispatch(unSetLoading());
        })
        .catch((error) => {
          console.error("녹화 시작 중 오류 발생:", error);
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized.");
    }
  };

  const handleRecordStop = () => {
    if (session) {
      dispatch(setLoading());
      console.log(session.sessionId);
      stopRecording({
        recording: session.sessionId,
      })
        .then((resp) => {
          setIsRecording(false);
          dispatch(unSetLoading());
        })
        .catch((error) => {
          console.error("녹화 중지 중 오류 발생:", error);
          dispatch(unSetLoading());
        });
    } else {
      console.error("Session is not initialized.");
    }
  };

  const sendMessage = () => {
    if (session && newMessage.trim() !== "") {
      session.signal({
        data: newMessage,
        type: "chat",
      });
      setNewMessage("");
    }
  };

  return (
    <div style={{ padding: "-8px" }}>
      {isPublisher === true ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          {/* <div ref={videoRef}></div> */}
          <video
            autoPlay={true}
            ref={videoRef}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          ></video>
          {/* <OpenViduVideoComponent streamManager={publisher}/> */}
          <button onClick={handleRecordStart} disabled={isRecording}>
            Start Recording
          </button>
          <button onClick={handleRecordStop} disabled={!isRecording}>
            Stop Recording
          </button>
        </div>
      ) : (
        <video autoPlay={true} ref={videoRef}></video>
      )}

      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.from}</strong>: {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default OpenVideo;
