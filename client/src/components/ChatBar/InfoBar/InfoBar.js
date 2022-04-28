import React, { useState, useEffect } from "react";
import { Card, Msger } from "./InforBar.styled";
import { Body } from "../ChatHeader/ChatHeader.styled";
import Main from "../Main/Main";
import ChatFooter from "../ChatFooter/ChatFooter";
import ChatHeader from "../ChatHeader/ChatHeader";
import { useSelector } from "react-redux";

const InfoBar = (props) => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(props.messages);
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    socket.emit("join", props.room, (error, messages) => {
      if (error) {
        return setError(error);
      }
      return setMessages(messages);
    });

    return () => {
      socket.emit("leave", props.room);
    };
  }, [props.member, props.room, socket]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log(message);
      setMessages((preMessages) => [...preMessages, message]);
    });
  }, []);

  const sendMessage = (e) => {
    try {
      e.preventDefault();
      if (message) {
        const newMesage = {
          content: message,
          senderId: props.user._id,
          messageDate: new Date(Date.now()),
        };
        socket.emit("sendMessage", newMesage, props.room, (error) => {
          if (error) {
            return setError(error);
          }
          return setMessage("");
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Msger>
        <ChatHeader member={props.member} room={props.room} />
        <Body>
          <Main messages={messages} />
        </Body>
        <ChatFooter onSendMessage={sendMessage} onSetMessage={setMessage} />
      </Msger>
    </Card>
  );
};

export default InfoBar;
