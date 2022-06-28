import React, { useEffect, useState } from "react";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaTelegramPlane, FaUndo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConversation } from "../../store/conversations-creator";
import { postAddFriend } from "../../store/friends-creator";
import { checkIsFriend } from "../../utilities/utilities";
import { Avatar } from "../Chat/ChatItems.styled";
import BouncyLoading from "../UI/BouncyLoading";
import {
  DialogContent,
  DialogInfo,
  DialogItem,
  DialogText,
  SentButton,
} from "./DialogItems.styled";
import { v4 as uuid4 } from "uuid";

const DialogMain = (props) => {
  const { friend, setNewMembers } = props;
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const dispatch = useDispatch();
  const { forward } = useSelector((state) => state.forward);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const { user } = useSelector((state) => state.user);
  const [isSend, setIsSend] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSentDone, setIsSentDone] = useState(false);
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
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
      props.isForward && !props.isGroup
        ? chatSocket.emit(
            "forwardMessage",
            {
              message: {
                isForward: true,
                _id: uuid4(),
                content: forward.message.content,
                files: forward.message.files,
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
          )
        : chatSocket.emit(
            "forwardGroupMessage",
            {
              message: {
                isForward: true,
                _id: uuid4(),
                content: forward.message.content,
                files: forward.message.files,
                messageDate: new Date(Date.now()),
                senderId: user,
                reply: null,
              },
              room: props.room,
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
    props.isGroup,
    props.room,
    isSentDone,
  ]);

  useEffect(() => {
    if (isCheckBox) {
      return setNewMembers((preMembers) => [...preMembers, friend]);
    }
    setNewMembers((preMembers) => {
      const index = preMembers.findIndex((member) => member._id === friend._id);
      preMembers.splice(index, 1);
      return [...preMembers];
    });
  }, [isCheckBox, friend, setNewMembers]);

  const closeDialog = () => {
    if (!isSent) {
      return setIsSend(!isSend);
    }
  };

  const newChatHandler = () => {
    if (!props.isForward && !props.newGroup) {
      if (props.isGroup) {
        navigate(
          `/video-chat/Chats/group/${encodeURIComponent(props.groupName)}`
        );
        return props.setShowModalDialog(false);
      }

      if (checkIsFriend(user, friend, conversation?.conv)) {
        navigate(`/video-chat/Chats/${encodeURIComponent(friend.name)}`);
        props.setShowModalDialog(false);
      } else {
        // create group between 2 people
        return dispatch(
          postAddFriend(
            friend._id,
            friend.name,
            navigate,
            props.setShowModalDialog,
            setIsFetch
          )
        );
      }
    }
  };

  const addNewMembers = (e) => {
    setIsCheckBox(e.target.checked);
  };

  return (
    <DialogItem
      isFetch={isFetch}
      newGroup={props.newGroup}
      isForward={props.isForward}
    >
      <div onClick={newChatHandler}>
        {isFetch ? (
          <BouncyLoading />
        ) : (
          <>
            <Avatar isLoggined={friend?.isLoggined} header="Chats">
              <img
                src={
                  props.groupImg
                    ? props.groupImg
                    : `${ENDPOINT_CLIENT}/${friend.avata}`
                }
                alt=""
              />
            </Avatar>
            <DialogContent>
              <DialogInfo>
                <h6>{props.isGroup ? props.groupName : friend.name}</h6>
              </DialogInfo>
              <DialogText>
                <p>
                  {props.isGroup
                    ? props.numsPeople + " participants"
                    : friend?.isLoggined
                    ? "Online"
                    : "Offline"}
                </p>
              </DialogText>
            </DialogContent>
          </>
        )}
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
        {props.newGroup && (
          <div className="btn">
            <input
              type="checkbox"
              checked={isCheckBox}
              onChange={addNewMembers}
            />
          </div>
        )}
      </div>
    </DialogItem>
  );
};

export default DialogMain;
