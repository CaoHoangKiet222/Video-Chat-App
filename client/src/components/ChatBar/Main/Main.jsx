import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { checkSameDate, searchToDisplay } from "../../../utilities/utilities";
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
    props.messages
      ?.filter((message) => {
        console.log(message);
        if (message.content) {
          return searchToDisplay(message.content, props.searchName);
        }

        return (
          message.files.attachments.findIndex(({ fileName }) => {
            return searchToDisplay(fileName, props.searchName);
          }) !== -1
        );
      })
      .map((message, index) => {
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
          if (message.senderId?._id === conversation.user?._id) {
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
    <MessageContainer showSearchBox={props.showSearchBox}>
      <MessageContent>{messages}</MessageContent>
    </MessageContainer>
  );
};

export default Main;
