import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import baseAxios from "../utils/httpCommons";
import { OpenVidu } from "openvidu-browser";
import { useDispatch } from "react-redux";
import { setLoading, unSetLoading } from "../features/openvido/loadingSlice";

const baseURL = baseAxios();

const OpenVideo = () => {
  async function getToken(param) {
    try {
      const res = await baseURL.post("/recording-java/api/get-token", param);
      console.log(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  }
  function startRecording(param) {
    return baseURL.post("/recording-java/api/recording/start", param);
  }
  function stopRecording(param) {
    return baseURL.post("/recording-java/api/recording/stop", param);
  }

  function removeUser(param) {
    return baseURL.post("/recording-java/api/remove-user", param);
  }
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);

  const dispatch = useDispatch();
  const { sessionName } = useParams();
  let publisher;
  let subscribers = [];

  useEffect(() => {
    dispatch(setLoading());

    MakeSession(videoRef, dispatch, sessionName)
      .then((session) => {
        console.log("MakeSession 성공");
        setSession(session);
      })
      .catch((error) => {
        console.error("MakeSession 오류:", error);
        dispatch(unSetLoading());
      });

    return () => {
      if (session) {
        if (publisher) {
          publisher = null;
        }
        session.disconnect();
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
          videoRef.current,
          {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "1000x562",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          },
          () => {
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
    <div>
      {isPublisher === true ? (
        <div>
          <div ref={videoRef}></div>
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
