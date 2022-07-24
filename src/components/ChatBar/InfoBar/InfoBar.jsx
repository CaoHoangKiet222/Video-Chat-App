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
import SearchBox from "../ChatHeader/SearchBox";
import ChatDetail from "./ChatDetail";
import { errorActions } from "../../../store/error-slice";

const InfoBar = (props) => {
  const [messages, setMessages] = useState([]);
  const [isSendMess, setIsSendMess] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showViewInfo, setShowViewInfo] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useDispatch();
  const { chatSocket, notifySocket } = useSelector((state) => state.socket);

  useEffect(() => {
    chatSocket.emit("joinRoom", props.room, (messages, error = null) => {
      if (error) {
        return dispatch(
          errorActions.setError({
            error: true,
            message: error.message,
          })
        );
      }
      setMessages(messages);

      setIsFetch(true);
    });

    return () => {
      chatSocket.emit("leaveRoom", props.room);
      setIsFetch(false);
    };
  }, [props.room, chatSocket, dispatch]);

  useEffect(() => {
    chatSocket.on("deleteMessage", (message) => {
      setMessages((preMess) => {
        const index = preMess.findIndex((mess) => mess._id === message._id);
        index !== -1 && preMess.splice(index, 1);
        preMess.forEach((mess) => {
          if (mess.reply !== null && mess.reply.message_id === message._id) {
            mess.reply = null;
          }
        });
        return [...preMess];
      });
      dispatch(fetchConversation());
    });

    chatSocket.on("receiveMessage", (message) => {
      setIsSendMess(true);
      setMessages((preMessages) => [...preMessages, message]);
    });

    chatSocket.on("leaveRoom", () => {
      setIsSendMess(false);
    });

    return () => {
      chatSocket.off("deleteMessage");
      chatSocket.off("receiveMessage");
      chatSocket.off("leaveRoom");
    };
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
          senderId: props.user,
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
          (error) => {
            if (error) {
              return dispatch(
                errorActions.setError({
                  error: true,
                  message: error.message,
                })
              );
            }
            notifySocket.emit("notifyingUserSendMess");
            return dispatch(fetchConversation());
          }
        );

        setMessages((preMess) => [...preMess, newMesage]);
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
        <ChatHeader
          handleSearchBox={handleSearchBox}
          handleViewInfo={handleViewInfo}
          member={props.member}
          block={props.block}
          room={props.room}
        />
        <SearchBox
          showSearchBox={showSearchBox}
          setSearchName={setSearchName}
        />
        {!isFetch && !isSendMess ? (
          <InfoBarLoading />
        ) : (
          <Body>
            <Main
              messages={messages}
              setMessages={setMessages}
              showSearchBox={showSearchBox}
              searchName={searchName}
              room={props.room}
              block={props.block}
            />
          </Body>
        )}
        <ChatFooter
          member={props.member}
          onSendMessage={sendMessage}
          block={props.block}
          room={props.room}
        />
      </Msger>
      <ChatDetail
        handleViewInfo={handleViewInfo}
        showViewInfo={showViewInfo}
        member={props.member}
        messages={messages}
      />
    </Card>
  );
};

export default InfoBar;
