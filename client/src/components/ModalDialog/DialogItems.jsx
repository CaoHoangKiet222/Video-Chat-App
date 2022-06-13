import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const closeDialog = () => {
    props.setShowModalDialog(false);
  };

  return (
    <DialogList>
      {props.friends
        ?.filter((friend) => {
          return searchUser(friend, props.searchName);
        })
        .map((friend) => {
          return (
            <DialogItem key={friend._id} onClick={closeDialog}>
              <Link to={`/video-chat/Chats/${encodeURIComponent(friend.name)}`}>
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
