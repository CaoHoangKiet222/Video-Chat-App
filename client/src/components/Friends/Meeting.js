import React, { useEffect, useRef } from "react";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Buttons,
  Container,
  Content,
  ImgWrapper,
  Join,
  Picture,
  RoundedButton,
} from "./Meeting.styled";
import { FiPhoneOff, FiPhone, FiVideo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { answerCall, callToUser } from "../../store/video-creator";
import { getUserMedia } from "../../utilities/utilities";
import { videoActions } from "../../store/video-slice";

const Meeting = () => {
  console.log("Meeting running");
  const params = useParams();
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { isReceiving, callee, caller } = useSelector(
    (state) => state.video.call
  );
  const { callAccepted, callEnded, stream } = useSelector(
    (state) => state.video
  );
  const { meetingSocket } = useSelector((state) => state.socket);
  const myVideo = useRef(),
    userVideo = useRef(),
    connectionRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const currentStream = getUserMedia();
    dispatch(videoActions.setStream({ currentStream }));
  }, [dispatch]);

  useEffect(() => {
    meetingSocket.on("callToUser", ({ signal }) => {
      dispatch(videoActions.setCallSignal({ signal }));
    });
  });

  useEffect(() => {
    if (stream) {
      console.log("stream", stream);
      dispatch(callToUser(meetingSocket, userVideo, connectionRef));
      // myVideo.current.srcObject = stream;
      console.log("myVideo stream done");
    }
  }, [stream, dispatch, meetingSocket]);

  const closePhone = () => {
    meetingSocket.emit("notAnswerCall", params.meetingId);
  };

  const acceptPhone = () => {
    console.log("acceptPhone");
    dispatch(answerCall(userVideo, connectionRef));
  };
  console.log(isReceiving, callee.name, caller.name);

  return !callAccepted ? (
    <Container>
      <Content>
        <Join>
          <img
            src={`/images/${
              !isReceiving ? "outgoing-call.svg" : "incoming-call.svg"
            }`}
            alt=""
          />
          <p className="name">
            {!isReceiving ? "OUTGOING CALL" : "INCOMING CALL"}
          </p>
          <p className="title">{isReceiving ? caller.name : callee.name}</p>
          <Picture>
            <ImgWrapper>
              <Avatar>
                <img
                  src={`${ENDPOINT_CLIENT}/${
                    isReceiving ? callee.avata : caller.avata
                  }`}
                  alt=""
                />
              </Avatar>
            </ImgWrapper>
          </Picture>
          <Buttons>
            <RoundedButton className="close" onClick={closePhone}>
              <FiPhoneOff />
            </RoundedButton>
            {isReceiving && (
              <>
                <RoundedButton className="accept" onClick={acceptPhone}>
                  <FiPhone />
                </RoundedButton>
                <RoundedButton>
                  <FiVideo />
                </RoundedButton>
              </>
            )}
          </Buttons>
        </Join>
      </Content>
    </Container>
  ) : (
    <>
      {stream && (
        <>
          <h1>Hello myVideo</h1>
          <video
            ref={myVideo}
            muted={true}
            playsInline={true}
            autoPlay={true}
          />
        </>
      )}

      {!callEnded && (
        <>
          <h1>Hello userVideo</h1>
          <video
            ref={userVideo}
            muted={true}
            playsInline={true}
            autoPlay={true}
          />
        </>
      )}
    </>
  );
};

export default Meeting;
