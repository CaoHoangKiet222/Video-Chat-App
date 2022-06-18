import React, { useState, useEffect } from "react";
import { Card, Msger } from "./InfoBar.styled";
import { Body } from "../ChatHeader/ChatHeader.styled";
import Main from "../Main/Main";
import ChatFooter from "../ChatFooter/ChatFooter";
import ChatHeader from "../ChatHeader/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import InfoBarLoading from "./InfoBarLoading";
import { fetchConversation } from "../../../store/conversations-creator";
let timer;

const InfoBar = (props) => {
  console.log("InfoBar running");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(props.messages);
  const [messages, setMessages] = useState([]);
  const [isSendMess, setIsSendMess] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useDispatch();
  const chatSocket = useSelector((state) => state.socket.chatSocket);

  useEffect(() => {
    chatSocket.emit("joinRoom", props.room, (messages, error = null) => {
      if (error) {
        return setError(error);
      }
      setMessages(messages);

      timer = setTimeout(() => {
        setIsFetch(true);
      }, 50);
    });

    return () => {
      chatSocket.emit("leaveRoom", props.room);
      setIsFetch(false);
      clearTimeout(timer);
    };
  }, [props.room, chatSocket]);

  useEffect(() => {
    chatSocket.on("leaveRoom", () => {
      setIsSendMess(false);
    });
  }, [chatSocket]);

  useEffect(() => {
    chatSocket.on("receiveMessage", (message) => {
      dispatch(fetchConversation());
      setIsSendMess(true);
      setMessages((preMessages) => [...preMessages, message]);
    });
  }, [chatSocket, dispatch]);

  const sendMessage = (e, replyContent = "") => {
    try {
      e.preventDefault();
      if (message) {
        const newMesage = {
          content: message,
          sender: props.user,
          messageDate: new Date(Date.now()),
          reply: replyContent,
        };

        chatSocket.emit(
          "sendMessage",
          newMesage,
          props.room,
          (error, message) => {
            if (error) {
              return setError(error);
            }
            setMessages((preMess) => [...preMess, message]);
            dispatch(fetchConversation());
            return setMessage("");
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Msger>
        <ChatHeader member={props.member} room={props.room} />
        {!isFetch && !isSendMess ? (
          <InfoBarLoading />
        ) : (
          <Body>
            <Main
              messages={messages}
              setMessages={setMessages}
              room={props.room}
            />
          </Body>
        )}
        <ChatFooter
          member={props.member}
          onSendMessage={sendMessage}
          onSetMessage={setMessage}
        />
      </Msger>
    </Card>
  );
};

export default InfoBar;
