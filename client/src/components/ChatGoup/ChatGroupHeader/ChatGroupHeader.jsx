import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsSearch, BsTelephone } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { errorActions } from "../../../store/error-slice";
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
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);
  const user = useSelector((state) => state.user.user);

  const callGroupHandler = () => {
    const onlineMems = getMembersInGroupOnline(members);
    if (onlineMems.length > 1) {
      return meetingSocket.emit(
        "meetingGroupConnection",
        { room, caller: user },
        () => {
          navigate(`/meeting-group/${room}`);
        }
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
