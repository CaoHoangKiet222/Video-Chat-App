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
import { callToUser } from "../../store/video-creator";

const formatDate = (date) => {
  date = new Date(date);
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  if (parseInt(h.slice(-2)) >= 13) {
    return `${h.slice(-2)}:${m.slice(-2)} pm`;
  }
  return `${h.slice(-2)}:${m.slice(-2)} am`;
};

const ChatItems = (props) => {
  const member = props.member;
  const { user } = useSelector((state) => state.user);
  const { stream } = useSelector((state) => state.video);
  const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userVideo = useRef();
  const connectionRef = useRef();
  const { socket } = useSelector((state) => state.socket);

  let pathname;
  if (props.header === "Friends") {
    pathname = `/video-chat/${props.header}/list-friends/${encodeURIComponent(
      member.name
    )}`;
  } else
    pathname = `/video-chat/${props.header}/${encodeURIComponent(member.name)}`;

  useEffect(() => {
    if (member && user) {
      socket.emit("joinVideo", { user, friend: member });
      // return () => {
      //    socket.disconnect();
      //    socket.off();
      // }
    }
  }, [member, user, socket]);

  useEffect(() => {
    socket.on("callToUser", ({ callId, signal, caller, callee }) => {
      console.log("callId", callId);
      console.log("signal", signal);
      dispatch(
        videoActions.setCall({
          call: {
            callId,
            callee,
            caller,
            signal,
          },
        })
      );
      navigate(`/video-chat/Chats/meeting/${encodeURIComponent(callId)}`);
    });
  }, []);

  useEffect(() => {
    if (stream) {
      console.log("hello");
      dispatch(callToUser(socket, userVideo, connectionRef));
    }
    return () => {
      dispatch(videoActions.setStream({ currentStream: null }));
    };
  }, [stream]);

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
                <div>{formatDate(props.messageDate)}</div>
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
