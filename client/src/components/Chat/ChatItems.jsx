import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  ChatContent,
  ChatInfo,
  ChatItem,
  ChatText,
  ContactActions,
} from "./ChatItems.styled";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { formatHour } from "../../utilities/utilities";
import { HiPhoneIncoming, HiPhoneOutgoing } from "react-icons/hi";
import { RiPhoneLine } from "react-icons/ri";

const ChatItems = (props) => {
  const member = props.member;
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);

  let pathname;
  if (props.header === "Friends") {
    pathname = `/video-chat/${props.header}/list-friends/${encodeURIComponent(
      member.name
    )}`;
  } else if (props.header === "Calls") {
    pathname = `/video-chat/${props.header}/details/${encodeURIComponent(
      member.name
    )}`;
  } else
    pathname = `/video-chat/${props.header}/${encodeURIComponent(member.name)}`;

  useEffect(() => {
    if (props.room) {
      meetingSocket.emit("joinVideo", {
        conversationId: props.room,
      });
    }
  }, [meetingSocket, props.room]);

  return (
    <>
      {props.header === "Friends" && props.isDiff && (
        <li>{member.name[0].toUpperCase()}</li>
      )}
      <ChatItem>
        <Link to={pathname}>
          <Avatar header={props.header} isLoggined={member.isLoggined}>
            <img src={`${member.avatar.url}`} alt="" />
          </Avatar>
          <ChatContent>
            <ChatInfo>
              <h6>{member.name}</h6>
              {props.header === "Chats" && (
                <div>
                  {props.messageDate
                    ? formatHour(props.messageDate)
                    : formatHour(Date.now())}
                </div>
              )}
            </ChatInfo>
            <ChatText accepted={props.call?.accepted} type={props.header}>
              {props.header === "Chats" && <p>{props.content}</p>}
              {props.header === "Calls" && (
                <>
                  {props.call.isReceived ? (
                    <HiPhoneIncoming />
                  ) : (
                    <HiPhoneOutgoing />
                  )}
                  <p>{props.firstStartCall}</p>
                </>
              )}
              {props.header === "Friends" && (
                <>
                  <FaMapMarkerAlt />
                  <p>{props.address}</p>
                </>
              )}
            </ChatText>
          </ChatContent>
          {props.header === "Calls" && (
            <ContactActions>
              <button>
                <RiPhoneLine />
              </button>
            </ContactActions>
          )}
        </Link>
      </ChatItem>
    </>
  );
};

export default ChatItems;
