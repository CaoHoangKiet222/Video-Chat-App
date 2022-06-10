import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { checkSameDate } from "../../../utilities/utilities";
import { MessageContainer, MessageContent } from "./Main.styled";
import Messages from "./Messages";
import { v4 as uuidv4 } from "uuid";

const Main = (props) => {
  // console.log("Main running");
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
        if (message.senderId === conversation.user._id) {
          return (
            <Messages
              key={uuidv4()}
              message={message}
              time={message.messageDate}
              timeChange={timeChange.current}
              isRight={true}
              setMessages={props.setMessages}
              conversationId={props.room}
            />
          );
        }
        return (
          <Messages
            key={uuidv4()}
            message={message}
            time={message.messageDate}
            preTime={preTime.current}
            setMessages={props.setMessages}
            conversationId={props.room}
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

export default Main;
