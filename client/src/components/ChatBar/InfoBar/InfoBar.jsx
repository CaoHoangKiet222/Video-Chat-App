import React, { useState, useEffect } from "react";
import { Card, Msger } from "./InfoBar.styled";
import { Body } from "../ChatHeader/ChatHeader.styled";
import Main from "../Main/Main";
import ChatFooter from "../ChatFooter/ChatFooter";
import ChatHeader from "../ChatHeader/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import InfoBarLoading from "./InfoBarLoading";
import { fetchConversation } from "../../../store/conversations-creator";
import { v4 as uuid4 } from "uuid";
let timer;

const InfoBar = (props) => {
  console.log("InfoBar running");
  const [error, setError] = useState("");
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
    chatSocket.on("deleteMessage", (message) => {
      console.log(message);
      setMessages((preMess) => {
        const index = preMess.findIndex((mess) => mess._id === message._id);
        index !== -1 && preMess.splice(index, 1);
        preMess.forEach((mess) => {
          console.log(mess);
          mess.reply && console.log(mess.reply.message_id, message._id);
          if (mess.reply !== null && mess.reply.message_id === message._id) {
            mess.reply = null;
          }
        });
        return [...preMess];
      });
      dispatch(fetchConversation());
    });

    return () => {
      chatSocket.off("deleteMessage");
    };
  }, [chatSocket, dispatch]);

  useEffect(() => {
    chatSocket.on("receiveMessage", (message) => {
      console.log(message);
      dispatch(fetchConversation());
      setIsSendMess(true);
      setMessages((preMessages) => [...preMessages, message]);
    });
  }, [chatSocket, dispatch]);

  const sendMessage = (e, replyContent, message, files) => {
    try {
      e.preventDefault();
      if (
        message ||
        files.images.length !== 0 ||
        files.attachments.length !== 0
      ) {
        if (replyContent) {
          replyContent = { ...replyContent };
          delete replyContent.isClick;
        }

        const newMesage = {
          _id: uuid4(),
          content: message,
          files,
          sender: props.user,
          messageDate: new Date(Date.now()),
          reply: replyContent,
        };

        chatSocket.emit(
          "sendMessage",
          {
            message: newMesage,
            room: props.room,
            type: "single",
          },
          (error, message) => {
            if (error) {
              return setError(error);
            }
            setMessages((preMess) => [...preMess, message]);
            return dispatch(fetchConversation());
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
        <ChatFooter member={props.member} onSendMessage={sendMessage} />
      </Msger>
    </Card>
  );
};

export default InfoBar;
