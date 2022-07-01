import React, { useEffect } from "react";
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
import { videoActions } from "../../store/video-slice";
import { errorActions } from "../../store/error-slice";

const Meeting = () => {
  console.log("Meeting running");
  const params = useParams();
  const { isReceiving, callee, caller } = useSelector(
    (state) => state.video.call
  );
  const { callAccepted, stream } = useSelector((state) => state.video);
  const { meetingSocket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    // Off stream for only 2 members when close video
    meetingSocket.on("notAnswerCall", () => {
      dispatch(
        errorActions.setError({
          error: true,
          message: isReceiving
            ? "Caller canceled the call"
            : "Your callee canceled the call",
        })
      );
      dispatch(leaveCall(navigate, stream));
    });

    return () => {
      meetingSocket.off("notAnswerCall");
    };
  }, [dispatch, meetingSocket, navigate, stream, isReceiving]);

  useEffect(() => {
    console.log(isReceiving);
    if (stream && !isReceiving) {
      dispatch(callToUser());
    }
  }, [stream, dispatch, isReceiving]);

  const closeVideo = () => {
    meetingSocket.emit(
      "notAnswerCall",
      {
        callId: params.meetingId,
        call: {
          calleeId: callee._id,
          callerId: caller._id,
          startCall: new Date(Date.now()),
          callAccepted: false,
        },
      },
      () => {
        dispatch(leaveCall(navigate, stream));
      }
    );
  };

  const acceptPhone = () => {
    dispatch(
      answerCall(
        {
          calleeId: callee._id,
          callerId: caller._id,
          startCall: new Date(Date.now()),
          callAccepted: true,
        },
        "phone"
      )
    );
  };

  const acceptVideo = () => {
    dispatch(
      answerCall(
        {
          calleeId: callee._id,
          callerId: caller._id,
          startCall: new Date(Date.now()),
          callAccepted: true,
        },
        "video"
      )
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
                  src={`${isReceiving ? caller.avatar.url : callee.avatar.url}`}
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
                <RoundedButton className="accept" onClick={acceptPhone}>
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
