import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { checkSameDate } from "../../../utilities/utilities";
import Messages from "../../ChatBar/Main/Messages";
import { v4 as uuidv4 } from "uuid";
import {
  MessageContainer,
  MessageContent,
} from "../../ChatBar/Main/Main.styled";

const ChatGroupMain = (props) => {
  console.log("ChatGroupMain running");
  const { conversation } = useSelector((state) => state.conversation);
  const preTime = useRef(null);
  const timeChange = useRef(true);
  const messages =
    conversation &&
    props.messages?.map((message, index) => {
      if (message) {
        if (
          !checkSameDate(preTime.current, message.messageDate) ||
          index === 0
        ) {
          preTime.current = message.messageDate;
          timeChange.current = true;
        } else {
          timeChange.current = false;
        }
        if (message.senderId._id === conversation.user._id) {
          return (
            <Messages
              key={uuidv4()}
              message={message}
              time={message.messageDate}
              timeChange={timeChange.current}
              isRight={true}
              setMessages={props.setMessages}
              conversationId={props.room}
              isGroup={props.isGroup}
            />
          );
        }
        return (
          <Messages
            key={uuidv4()}
            message={message}
            time={message.messageDate}
            timeChange={timeChange.current}
            setMessages={props.setMessages}
            conversationId={props.room}
            isGroup={props.isGroup}
          />
        );
      }
    });

  return (
    <MessageContainer>
      <MessageContent>{messages}</MessageContent>
    </MessageContainer>
  );
};

export default ChatGroupMain;