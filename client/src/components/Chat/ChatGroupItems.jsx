import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatHour } from "../../utilities/utilities";
import {
  ChatGroupAvatar,
  ChatGroupContent,
  ChatGroupItem,
  ChatGroupText,
} from "./ChatGroupItems.styled";
import { ChatInfo } from "./ChatItems.styled";

const ChatGroupItems = (props) => {
  const { meetingSocket } = useSelector((state) => state.socket);

  let pathname = `/video-chat/Chats/group/${encodeURIComponent(
    props.groupName
  )}`;

  useEffect(() => {
    if (props.room) {
      meetingSocket.emit("joinVideo", {
        conversationId: props.room,
      });
    }
  }, [meetingSocket, props.room]);

  return (
    <ChatGroupItem>
      <Link to={pathname}>
        <ChatGroupAvatar>
          <img src={`${props.groupImg}`} alt="" />
        </ChatGroupAvatar>
        <ChatGroupContent>
          <ChatInfo>
            <h6>{props.groupName}</h6>
            <div>
              {props.messageDate
                ? formatHour(props.messageDate)
                : formatHour(Date.now())}
            </div>
          </ChatInfo>
          <ChatGroupText>
            <p>{props.content}</p>
          </ChatGroupText>
        </ChatGroupContent>
      </Link>
    </ChatGroupItem>
  );
};

export default ChatGroupItems;
