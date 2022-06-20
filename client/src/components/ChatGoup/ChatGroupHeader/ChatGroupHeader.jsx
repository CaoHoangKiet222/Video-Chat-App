import React, { useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsSearch, BsTelephone } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { errorActions } from "../../../store/error-slice";
import { beforeStartVideo } from "../../../store/video-creator";
import { getMembersInGroupOnline } from "../../../utilities/utilities";
import { ChatGroupAvatar } from "../../Chat/ChatGroupItems.styled";
import {
  HeaderBar,
  Media,
  MediaContent,
  MediaInfo,
  MediaNav,
} from "../../ChatBar/ChatHeader/ChatHeader.styled";

const ChatGroupHeader = ({
  groupImg,
  groupName,
  numsPeople,
  members,
  room,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const error = useRef(null);

  const callGroupHandler = () => {
    const onlineMems = getMembersInGroupOnline(members);
    if (onlineMems.length > 1) {
      return dispatch(
        beforeStartVideo("Caller", onlineMems, user, room, navigate, error)
      );
    }

    dispatch(
      errorActions.setError({
        error: true,
        message: "Can't call members because no one is online",
      })
    );
  };

  return (
    <HeaderBar>
      <Media>
        <ChatGroupAvatar>
          <img src={groupImg} alt="" />
        </ChatGroupAvatar>
        <MediaContent>
          <MediaInfo>
            <h6>{groupName}</h6>
          </MediaInfo>
          <small>{numsPeople} participants</small>
        </MediaContent>
      </Media>
      <MediaNav>
        <li>
          <Link to="">
            <BsSearch />
          </Link>
        </li>
        <li onClick={callGroupHandler}>
          <Link to="">
            <BsTelephone />
          </Link>
        </li>
        <li>
          <Link
            to=""
            onClick={(e) => {
              e.target.style.color = "#d5d5e5";
            }}
          >
            <BiDotsVerticalRounded />
          </Link>
        </li>
      </MediaNav>
    </HeaderBar>
  );
};

export default ChatGroupHeader;
