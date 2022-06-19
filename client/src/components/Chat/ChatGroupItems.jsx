import React from "react";
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
  let pathname = `/video-chat/Chats/group/${encodeURIComponent(
    props.groupName
  )}`;

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
