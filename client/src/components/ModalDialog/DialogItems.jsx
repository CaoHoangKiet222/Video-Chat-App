import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forwardActions } from "../../store/forward-slice";
import { searchUser } from "../../utilities/utilities";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  DialogContent,
  DialogInfo,
  DialogItem,
  DialogList,
  DialogText,
} from "./DialogItems.styled";

const DialogItems = (props) => {
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const dispatch = useDispatch();
  const { forward } = useSelector((state) => state.forward);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const { user } = useSelector((state) => state.user);

  const closeDialog = (friend) => {
    props.setShowModalDialog(false);

    forwardHandler(friend);
  };

  const forwardHandler = (friend) => {
    console.log(forward);
    console.log(friend);

    chatSocket.emit(
      "forwardMessage",
      {
        // message: forward.message,
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
        dispatch(
          forwardActions.setForward({
            forward: { isClick: false, message: null },
          })
        );
      }
    );
  };

  return (
    <DialogList>
      {props.friends
        ?.filter((friend) => {
          return searchUser(friend, props.searchName);
        })
        .map((friend) => {
          return (
            <DialogItem
              key={friend._id}
              onClick={() => {
                closeDialog(friend);
              }}
            >
              <Link
                to={`${
                  props.isForward
                    ? "#"
                    : `/video-chat/Chats/${encodeURIComponent(friend.name)}`
                }`}
              >
                <Avatar>
                  <img src={`${ENDPOINT_CLIENT}/${friend.avata}`} alt="" />
                </Avatar>
                <DialogContent>
                  <DialogInfo>
                    <h6>{friend.name}</h6>
                  </DialogInfo>
                  <DialogText>
                    <p>Online</p>
                  </DialogText>
                </DialogContent>
              </Link>
            </DialogItem>
          );
        })}
    </DialogList>
  );
};

export default DialogItems;
