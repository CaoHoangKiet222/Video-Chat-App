import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../../store/conversations-creator";
import InfoBarLoading from "../ChatBar/InfoBar/InfoBarLoading";
import { CardGroup, CardMsger } from "./ChatGroup.styled";
import ChatGroupFooter from "./ChatGroupFooter/ChatGroupFooter";
import ChatGroupHeader from "./ChatGroupHeader/ChatGroupHeader";
import ChatGroupMain from "./ChatGroupMain/ChatGroupMain";
let timer;

const ChatGroup = (props) => {
  console.log("ChatGroup running");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(props.messages);
  const [messages, setMessages] = useState([]);
  const [isSendMess, setIsSendMess] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useDispatch();
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  // console.log(messages);

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
      console.log("receiveMessage");
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

        console.log("dsfasdfasdfasdfasdfas");
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
    <CardGroup>
      <CardMsger>
        <ChatGroupHeader
          groupImg={props.groupImg}
          groupName={props.groupName}
          numsPeople={props.members.length + 1}
        />
        {!isFetch && !isSendMess ? (
          <InfoBarLoading />
        ) : (
          <ChatGroupMain
            messages={messages}
            setMessages={setMessages}
            room={props.room}
          />
        )}
        <ChatGroupFooter
          members={props.members}
          onSendMessage={sendMessage}
          onSetMessage={setMessage}
        />
      </CardMsger>
    </CardGroup>
  );
};

export default ChatGroup;
