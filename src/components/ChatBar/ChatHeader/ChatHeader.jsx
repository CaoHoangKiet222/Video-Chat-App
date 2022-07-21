import React, { useEffect, useRef, useState } from "react";
import { BiBlock, BiDotsVerticalRounded } from "react-icons/bi";
import {
  BsArchive,
  BsInfoCircle,
  BsSearch,
  BsTelephone,
  BsVolumeMute,
} from "react-icons/bs";
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
import { DropDown, DropDownContent } from "../Main/Main.styled";
import { RiDeleteBinLine } from "react-icons/ri";
import { VscMute } from "react-icons/vsc";
import { MdOutlineWallpaper } from "react-icons/md";
import { closeComponent } from "../../../utilities/utilities";
import {
  blockConversation,
  deleteConversation,
} from "../../../store/conversations-creator";

const ChatHeader = (props) => {
  const { member } = props;
  const user = useSelector((state) => state.user.user);
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useRef(null);

  useEffect(() => {
    return closeComponent(showDropDown, setShowDropDown);
  }, [showDropDown]);

  const callHandler = () => {
    if (member.isLoggined && !props.block.isBlock) {
      return dispatch(
        beforeStartVideo("Caller", member, user, props.room, navigate, error)
      );
    }
    if (props.block.isBlock) {
      return dispatch(
        errorActions.setError({
          error: true,
          message:
            user._id === props.block?.byUserId
              ? `Can't call ${member.name} because you blocked this user`
              : `Can't call ${member.name} because you was blocked by this user`,
        })
      );
    }

    dispatch(
      errorActions.setError({
        error: true,
        message: "Can't call user because user is offline",
      })
    );
  };

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleBlock = () => {
    dispatch(
      blockConversation(
        props.room,
        { memberId: member._id, isAdmin: false, isBlock: props.block?.isBlock },
        "single"
      )
    );
  };

  const deleteHandler = () => {
    dispatch(deleteConversation(props.room, false, navigate, "single"));
  };

  return (
    <HeaderBar>
      <Media>
        <Avatar header="Chats" isLoggined={member.isLoggined}>
          <img src={`${member.avatar.url}`} alt="" />
        </Avatar>
        <MediaContent>
          <MediaInfo>
            <h6>{member.name}</h6>
          </MediaInfo>
          <small>{member.isLoggined ? "Online" : "Offline"}</small>
        </MediaContent>
      </Media>
      <MediaNav>
        <li onClick={props.handleSearchBox}>
          <Link to="">
            <BsSearch />
          </Link>
        </li>
        <li onClick={callHandler}>
          <Link to="">
            <BsTelephone />
          </Link>
        </li>
        <li onClick={handleDropDown}>
          <Link to="">
            <BiDotsVerticalRounded />
          </Link>

          {showDropDown && (
            <DropDown>
              <DropDownContent translate="translate(-200px, -10px)">
                <a href="#" onClick={props.handleSearchBox}>
                  <BsSearch />
                  <span>Search</span>
                </a>
                <a href="#" onClick={props.handleViewInfo}>
                  <BsInfoCircle />
                  <span>View Info</span>
                </a>
                <a href="#">
                  <VscMute />
                  <span>Mute Notifications</span>
                </a>
                <a href="#">
                  <MdOutlineWallpaper />
                  <span>Wallpaper</span>
                </a>
                <a href="#">
                  <BsArchive />
                  <span>Archive</span>
                </a>
                {(!props.block.isBlock ||
                  (props.block.isBlock &&
                    user._id === props.block?.byUserId)) && (
                  <a href="#" onClick={handleBlock}>
                    <BiBlock />
                    <span>{!props.block.isBlock ? "Block" : "Unblock"}</span>
                  </a>
                )}
                <a href="#" className="text-danger" onClick={deleteHandler}>
                  <RiDeleteBinLine />
                  <span>Delete</span>
                </a>
              </DropDownContent>
            </DropDown>
          )}
        </li>
      </MediaNav>
    </HeaderBar>
  );
};

export default ChatHeader;
