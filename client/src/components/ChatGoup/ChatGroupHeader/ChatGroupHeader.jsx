import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsSearch, BsTelephone } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ChatGroupAvatar } from "../../Chat/ChatGroupItems.styled";
import {
  HeaderBar,
  Media,
  MediaContent,
  MediaInfo,
  MediaNav,
} from "../../ChatBar/ChatHeader/ChatHeader.styled";

const ChatGroupHeader = ({ groupImg, groupName, numsPeople }) => {
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
        <li>
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
