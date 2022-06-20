import React, { useEffect, useRef, useState } from "react";
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
import { findImgGroup, findNameGroup } from "../../utilities/utilities";

const Meeting = () => {
  console.log("Meeting running");
  const params = useParams();
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { isReceiving, callee, caller } = useSelector(
    (state) => state.video.call
  );
  const areCallees = useRef(Array.isArray(callee));
  const [callees, setCallees] = useState(areCallees.current ? callee : []);
  const { conversation } = useSelector((state) => state.conversation);
  const user = useSelector((state) => state.user.user);
  const { callAccepted, stream, error } = useSelector((state) => state.video);
  const { meetingSocket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (areCallees.current) {
      setCallees([...callee]);
    }
  }, [callee]);

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
      dispatch(leaveCall(navigate, stream));
    });

    // Off stream for multiple members when close video
    meetingSocket.on("notAnswerGroupCall", ({ callId, call }) => {
      console.log("notAnswerGroupCall");
      console.log(call.callees);
      if (call.callees.length < 1) {
        return dispatch(leaveCall(navigate, stream));
      }
      setCallees([...call.callees]);
    });

    return () => {
      meetingSocket.off("notAnswerCall");
      meetingSocket.off("notAnswerGroupCall");
    };
  }, [dispatch, meetingSocket, navigate, stream]);

  useEffect(() => {
    console.log(isReceiving);
    if (stream && !isReceiving) {
      dispatch(callToUser());
    }
  }, [stream, dispatch, isReceiving]);

  console.log(callees);

  const closeVideo = () => {
    if (!areCallees.current) {
      meetingSocket.emit("notAnswerCall", {
        callId: params.meetingId,
        call: {
          calleeId: callee._id,
          callerId: caller._id,
          startCall: new Date(Date.now()),
          callAccepted: false,
        },
      });
    } else {
      console.log("sssssssssssssssssss");
      meetingSocket.emit(
        "notAnswerGroupCall",
        {
          callId: params.meetingId,
          userReject: user,
          call: {
            groupName: findNameGroup(conversation?.conv, params.meetingId),
            groupImg: findImgGroup(conversation?.conv, params.meetingId),
            callees,
            caller,
            startCall: new Date(Date.now()),
            callAccepted: false,
          },
        },
        () => {
          dispatch(leaveCall(navigate, stream));
        }
      );
    }
    // dispatch(leaveCall(connectionRef));
  };

  const acceptPhone = () => {
    if (!areCallees.current) {
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
    }
  };

  const acceptVideo = () => {
    if (!areCallees.current) {
      return dispatch(
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
    }
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
          <p className="title">
            {areCallees && !isReceiving
              ? "Calling to " + callees.length + " other participants"
              : areCallees && isReceiving
              ? "Group member " + caller.name
              : isReceiving
              ? caller.name
              : callee.name}
          </p>
          <Picture>
            <ImgWrapper>
              <Avatar>
                <img
                  src={
                    areCallees
                      ? `${findImgGroup(conversation?.conv, params.meetingId)}`
                      : `${ENDPOINT_CLIENT}/${
                          isReceiving ? callee.avata : caller.avata
                        }`
                  }
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
