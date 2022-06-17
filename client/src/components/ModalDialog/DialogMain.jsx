import React, { useEffect, useState } from "react";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaTelegramPlane, FaUndo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchConversation } from "../../store/conversations-creator";
import { postAddFriend } from "../../store/friends-creator";
import { checkIsFriend } from "../../utilities/utilities";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  DialogContent,
  DialogInfo,
  DialogItem,
  DialogText,
  SentButton,
} from "./DialogItems.styled";

const DialogMain = (props) => {
  const friend = props.friend;
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const dispatch = useDispatch();
  const { forward } = useSelector((state) => state.forward);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const { user } = useSelector((state) => state.user);
  const [isSend, setIsSend] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSentDone, setIsSentDone] = useState(false);
  const conversation = useSelector((state) => state.conversation.conversation);
  const navigate = useNavigate();

  useEffect(() => {
    let timer = 0;
    if (isSend) {
      timer = setTimeout(() => {
        setIsSent(true);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isSend]);

  useEffect(() => {
    const forwardHandler = (friend) => {
      props.isForward &&
        chatSocket.emit(
          "forwardMessage",
          {
            message: {
              isForward: true,
              content: forward.message.content,
              messageDate: new Date(Date.now()),
              senderId: user,
              reply: null,
            },
            user,
            friend,
          },
          () => {
            dispatch(fetchConversation());
            setIsSentDone(true);
          }
        );
    };

    isSent && !isSentDone && forwardHandler(friend);
  }, [
    isSent,
    friend,
    chatSocket,
    dispatch,
    forward,
    user,
    props.isForward,
    isSentDone,
  ]);

  const closeDialog = () => {
    if (!isSent) {
      return setIsSend(!isSend);
    }
  };

  const newChatHandler = (e) => {
    e.preventDefault();

    if (!props.isForward) {
      if (checkIsFriend(user, friend, conversation?.conv)) {
        navigate(`/video-chat/Chats/${encodeURIComponent(friend.name)}`);
      } else {
        dispatch(postAddFriend(friend._id, friend.name, navigate));
      }
      props.setShowModalDialog(false);
    }
  };

  return (
    <DialogItem isForward={props.isForward}>
      <Link to={"#"} onClick={newChatHandler}>
        <Avatar isLoggined={friend.isLoggined} header="Chats">
          <img src={`${ENDPOINT_CLIENT}/${friend.avata}`} alt="" />
        </Avatar>
        <DialogContent>
          <DialogInfo>
            <h6>{friend.name}</h6>
          </DialogInfo>
          <DialogText>
            <p>{friend.isLoggined ? "Online" : "Offline"}</p>
          </DialogText>
        </DialogContent>
        {props.isForward && (
          <SentButton
            isSent={isSent}
            onClick={() => {
              closeDialog();
            }}
          >
            <div className="container">
              <div className="envelope">
                {!isSend ? (
                  <BsEnvelopeFill />
                ) : !isSent ? (
                  <FaUndo />
                ) : (
                  <FaTelegramPlane />
                )}
              </div>
              <div className="text">
                <span>{!isSend ? "Send" : !isSent ? "Undo" : "Sent"}</span>
              </div>
            </div>
          </SentButton>
        )}
      </Link>
    </DialogItem>
  );
};

export default DialogMain;
