import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../../store/conversations-creator";
import ChatFooter from "../ChatBar/ChatFooter/ChatFooter";
import InfoBarLoading from "../ChatBar/InfoBar/InfoBarLoading";
import Main from "../ChatBar/Main/Main";
import { CardGroup, CardMsger } from "./ChatGroup.styled";
import ChatGroupHeader from "./ChatGroupHeader/ChatGroupHeader";
import { v4 as uuid4 } from "uuid";
let timer;

const ChatGroup = (props) => {
  console.log("ChatGroup running");
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
      setMessages((prepMess) => {
        const index = prepMess.findIndex((mess) => mess._id === message._id);
        index !== -1 && prepMess.splice(index, 1);
        return [...prepMess];
      });
      dispatch(fetchConversation());
    });

    return () => {
      chatSocket.off("deleteMessage");
    };
  }, [chatSocket, dispatch]);

  useEffect(() => {
    // this is important cannot replace
    chatSocket.on("receiveGroupMessage", (message) => {
      console.log(message);
      dispatch(fetchConversation());
      setIsSendMess(true);
      setMessages((preMessages) => [...preMessages, message]);
    });
  }, [chatSocket, dispatch]);

  const sendMessage = (e, replyContent = "", message, files) => {
    try {
      e.preventDefault();
      if (message || files.images.length !== 0) {
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
            type: "group",
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
    <CardGroup>
      <CardMsger>
        <ChatGroupHeader
          groupImg={props.groupImg}
          groupName={props.groupName}
          numsPeople={props.members.length + 1}
          members={props.members}
          room={props.room}
        />
        {!isFetch && !isSendMess ? (
          <InfoBarLoading />
        ) : (
          <Main
            messages={messages}
            setMessages={setMessages}
            room={props.room}
            isGroup={props.groupName !== "" ? true : false}
          />
        )}
        <ChatFooter members={props.members} onSendMessage={sendMessage} />
      </CardMsger>
    </CardGroup>
  );
};

export default ChatGroup;
