import React, { useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsSearch, BsTelephone } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../../Chat/ChatItems.styled";
import {
  HeaderBar,
  Media,
  MediaContent,
  MediaInfo,
  MediaNav,
} from "./ChatHeader.styled";
import { useDispatch, useSelector } from "react-redux";
import { beforeStartVideo } from "../../../store/video-creator";
import { errorActions } from "../../../store/error-slice";

const ChatHeader = (props) => {
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { member } = props;
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useRef(null);

  const callHandle = () => {
    if (member.isLoggined) {
      return dispatch(
        beforeStartVideo("Caller", member, user, props.room, navigate, error)
      );
    }

    dispatch(
      errorActions.setError({
        error: true,
        message: "Can't call user because user is offline",
      })
    );
  };

  return (
    <HeaderBar>
      <Media>
        <Avatar header="Chats" isLoggined={member.isLoggined}>
          <img src={`${ENDPOINT_CLIENT}/${member.avata}`} alt="" />
        </Avatar>
        <MediaContent>
          <MediaInfo>
            <h6>{member.name}</h6>
          </MediaInfo>
          <small>{member.isLoggined ? "Online" : "Offline"}</small>
        </MediaContent>
      </Media>
      <MediaNav>
        <li>
          <Link to="">
            <BsSearch />
          </Link>
        </li>
        <li onClick={callHandle}>
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

export default ChatHeader;
