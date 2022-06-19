import React, { useEffect, useRef } from "react";
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
  const pathName = useRef(null);

  useEffect(() => {
    pathName.current = `/video-chat/Chats/group/${encodeURIComponent(
      props.groupName
    )}`;
  }, [pathName, props.groupName]);

  return (
    <ChatGroupItem>
      <Link to={pathName.current}>
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
