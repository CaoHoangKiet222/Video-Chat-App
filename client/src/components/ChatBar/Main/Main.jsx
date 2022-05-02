import React from "react";
import {useSelector} from "react-redux";
import {MessageContainer, MessageContent} from "./Main.styled";
import Messages from "./Messages";

const Main = (props) => {
   const {conversation} = useSelector(state => state.conversation);
   const messages = conversation && props.messages?.map((message) => {
      if (message) {
         if (message.senderId === conversation.user._id) {
            return <Messages
               key={message._id}
               message={message.content}
               time={message.messageDate}
               isRight={true}
            />;
         }
         return <Messages
            key={message._id}
            message={message.content}
            time={message.messageDate}
         />;
      }
   });

   return (
      <MessageContainer>
         <MessageContent>
            {messages}
         </MessageContent>
      </MessageContainer>
   );
}

export default Main;
