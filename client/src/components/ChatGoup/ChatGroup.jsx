import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../../store/conversations-creator";
import ChatFooter from "../ChatBar/ChatFooter/ChatFooter";
import InfoBarLoading from "../ChatBar/InfoBar/InfoBarLoading";
import Main from "../ChatBar/Main/Main";
import { CardGroup, CardMsger } from "./ChatGroup.styled";
import ChatGroupHeader from "./ChatGroupHeader/ChatGroupHeader";
import { v4 as uuid4 } from "uuid";
import ChatDetail from "../ChatBar/InfoBar/ChatDetail";
import { Card, Msger } from "../ChatBar/InfoBar/InfoBar.styled";
import SearchBox from "../ChatBar/ChatHeader/SearchBox";
let timer;

const ChatGroup = (props) => {
  console.log("ChatGroup running");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSendMess, setIsSendMess] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showViewInfo, setShowViewInfo] = useState(false);
  const [searchName, setSearchName] = useState("");
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
        if (message.reply) {
          preMess.forEach((mess) => {
            // console.log(mess);
            // mess.reply && console.log(mess.reply.message_id, message._id);
            if (mess.reply !== null && mess.reply.message_id === message._id) {
              mess.reply = null;
            }
          });
        }
        return [...preMess];
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

  const handleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
  };

  const handleViewInfo = () => {
    setShowViewInfo(!showViewInfo);
  };

  return (
    <Card>
      <Msger showSearchBox={showSearchBox}>
        <ChatGroupHeader
          handleSearchBox={handleSearchBox}
          handleViewInfo={handleViewInfo}
          groupImg={props.groupImg}
          groupName={props.groupName}
          numsPeople={props.members.length + 1}
          members={props.members}
          room={props.room}
        />
        <SearchBox
          showSearchBox={showSearchBox}
          setSearchName={setSearchName}
        />
        {!isFetch && !isSendMess ? (
          <InfoBarLoading />
        ) : (
          <Main
            messages={messages}
            setMessages={setMessages}
            showSearchBox={showSearchBox}
            room={props.room}
            searchName={searchName}
            isGroup={props.groupName !== "" ? true : false}
          />
        )}
        <ChatFooter members={props.members} onSendMessage={sendMessage} />
      </Msger>
      <ChatDetail
        handleViewInfo={handleViewInfo}
        showViewInfo={showViewInfo}
        messages={messages}
        members={props.members}
        isGroup={true}
        groupImg={props.groupImg}
        groupName={props.groupName}
        numsPeople={props.members.length + 1}
      />
    </Card>
  );
};

export default ChatGroup;
