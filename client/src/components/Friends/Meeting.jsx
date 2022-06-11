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
import { answerCall, callToUser, leaveCall } from "../../store/video-creator";
import { getUserMedia } from "../../utilities/utilities";
import { videoActions } from "../../store/video-slice";

const Meeting = () => {
  console.log("Meeting running");
  const params = useParams();
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { isReceiving, callee, caller } = useSelector(
    (state) => state.video.call
  );
  const { callAccepted, stream } = useSelector((state) => state.video);
  const { meetingSocket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getUserMedia()
      .then((currentStream) => {
        console.log(currentStream);
        dispatch(videoActions.setStream({ currentStream }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (callAccepted) {
      meetingSocket.emit("joinMeetingRoom", { callId: params.meetingId });
    }
  }, [callAccepted, stream, meetingSocket, params]);

  useEffect(() => {
    meetingSocket.on("callToUser", ({ signal }) => {
      dispatch(videoActions.setCallSignal({ signal }));
    });

    meetingSocket.on("joinMeetingRoom", (callId) => {
      navigate(`/meeting/${callId}`);
    });
  }, [dispatch, meetingSocket, navigate]);

  useEffect(() => {
    // Off stream when close video
    meetingSocket.on("notAnswerCall", () => {
      dispatch(leaveCall(navigate, stream));
    });

    return () => {
      meetingSocket.off("notAnswerCall");
    };
  }, [dispatch, meetingSocket, navigate, stream]);

  useEffect(() => {
    if (stream && !isReceiving) {
      dispatch(callToUser());
    }
  }, [stream, dispatch, isReceiving]);

  const closeVideo = () => {
    meetingSocket.emit("notAnswerCall", {
      callId: params.meetingId,
      call: {
        calleeId: callee._id,
        callerId: caller._id,
        startCall: new Date(Date.now()),
        callAccepted: false,
      },
    });
    // dispatch(leaveCall(connectionRef));
  };

  const acceptVideo = () => {
    dispatch(
      answerCall({
        calleeId: callee._id,
        callerId: caller._id,
        startCall: new Date(Date.now()),
        callAccepted: true,
      })
    );
  };

  return (
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
            <RoundedButton className="close" onClick={closeVideo}>
              <FiPhoneOff />
            </RoundedButton>
            {isReceiving && (
              <>
                <RoundedButton className="accept">
                  <FiPhone />
                </RoundedButton>
                <RoundedButton onClick={acceptVideo}>
                  <FiVideo />
                </RoundedButton>
              </>
            )}
          </Buttons>
        </Join>
      </Content>
    </Container>
  );
};

export default Meeting;
