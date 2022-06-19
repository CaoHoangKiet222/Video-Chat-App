import React from "react";
import { CardGroup, CardMsger } from "./ChatGroup.styled";
import ChatGroupBody from "./ChatGroupBody/ChatGroupBody";
import ChatGroupFooter from "./ChatGroupFooter/ChatGroupFooter";
import ChatGroupHeader from "./ChatGroupHeader/ChatGroupHeader";

const ChatGroup = () => {
  return (
    <CardGroup>
      <CardMsger>
        <ChatGroupHeader />
        <ChatGroupBody />
        <ChatGroupFooter />
      </CardMsger>
    </CardGroup>
  );
};

export default ChatGroup;
