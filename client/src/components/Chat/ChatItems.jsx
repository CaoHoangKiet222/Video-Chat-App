import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  ChatContent,
  ChatInfo,
  ChatItem,
  ChatText,
} from "./ChatItems.styled";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { videoActions } from "../../store/video-slice";
import { formatHour } from "../../utilities/utilities";

const ChatItems = (props) => {
  const member = props.member;
  const user = useSelector((state) => state.user.user);
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);

  let pathname;
  if (props.header === "Friends") {
    pathname = `/video-chat/${props.header}/list-friends/${encodeURIComponent(
      member.name
    )}`;
  } else
    pathname = `/video-chat/${props.header}/${encodeURIComponent(member.name)}`;

  useEffect(() => {
    if (member && user) {
      meetingSocket.emit("joinVideo", { user, friend: member });
    }
  }, [member, user, meetingSocket]);

  useEffect(() => {
    meetingSocket.on(
      "meetingConnection",
      ({ callId, caller, callee, isReceiving }) => {
        dispatch(videoActions.setCallId({ callId }));
        dispatch(
          videoActions.setCall({
            call: {
              callee,
              caller,
              isReceiving,
            },
          })
        );
        navigate(`/video-chat/Chats/meeting/${encodeURIComponent(callId)}`);
      }
    );
  }, [dispatch, navigate, meetingSocket]);

  return (
    <>
      {props.header === "Friends" && props.isDiff && (
        <li>{member.name[0].toUpperCase()}</li>
      )}
      <ChatItem>
        <Link to={pathname}>
          <Avatar>
            <img src={`${ENDPOINT_CLIENT}/${member.avata}`} alt="" />
          </Avatar>
          <ChatContent>
            <ChatInfo>
              <h6>{member.name}</h6>
              {props.header === "Chats" && (
                <div>{formatHour(props.messageDate)}</div>
              )}
            </ChatInfo>
            <ChatText type={props.header}>
              {props.header === "Chats" && <p>{props.content}</p>}
              {props.header === "Friends" && (
                <>
                  <FaMapMarkerAlt />
                  <p>{props.address}</p>
                </>
              )}
            </ChatText>
          </ChatContent>
        </Link>
      </ChatItem>
    </>
  );
};

export default ChatItems;
