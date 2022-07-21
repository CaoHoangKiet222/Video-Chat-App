import React, { useEffect, useState } from "react";
import { BiBlock, BiDotsVerticalRounded } from "react-icons/bi";
import { BsArchive, BsInfoCircle, BsSearch, BsTelephone } from "react-icons/bs";
import { MdOutlineWallpaper } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { VscMute } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  blockConversation,
  deleteConversation,
} from "../../../store/conversations-creator";
import { errorActions } from "../../../store/error-slice";
import {
  closeComponent,
  getMembersInGroupOnline,
} from "../../../utilities/utilities";
import { ChatGroupAvatar } from "../../Chat/ChatGroupItems.styled";
import {
  HeaderBar,
  Media,
  MediaContent,
  MediaInfo,
  MediaNav,
} from "../../ChatBar/ChatHeader/ChatHeader.styled";
import { DropDown, DropDownContent } from "../../ChatBar/Main/Main.styled";

const ChatGroupHeader = ({
  groupImg,
  groupName,
  numsPeople,
  members,
  member,
  room,
  handleViewInfo,
  handleSearchBox,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);
  const user = useSelector((state) => state.user.user);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    return closeComponent(showDropDown, setShowDropDown);
  }, [showDropDown]);

  const callGroupHandler = () => {
    const onlineMems = getMembersInGroupOnline(members);
    if (onlineMems.length >= 2 && !member.block.isBlock) {
      return meetingSocket.emit(
        "meetingGroupConnection",
        { room, caller: user },
        () => {
          navigate(`/meeting-group/${room}`);
        }
      );
    }
    if (member.block.isBlock) {
      const { userId } = members.find((member) => {
        return member.userId._id === member.block.byUserId;
      });

      return dispatch(
        errorActions.setError({
          error: true,
          message:
            user._id === member.block?.byUserId
              ? `Can't call group because you blocked this conversation`
              : `Can't call group because you was blocked by admin ${userId.name}`,
        })
      );
    }

    dispatch(
      errorActions.setError({
        error: true,
        message: "Can't call members because no one is online",
      })
    );
  };

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const deleteHandler = () => {
    console.log(members);
    dispatch(deleteConversation(room, member.isAdmin, navigate, "group"));
  };

  const handleBlock = () => {
    console.log(members);
    dispatch(
      blockConversation(
        room,
        { isAdmin: member.isAdmin, isBlock: member.block.isBlock },
        "group"
      )
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
        <li onClick={handleSearchBox}>
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
          <Link to="" onClick={handleDropDown}>
            <BiDotsVerticalRounded />
          </Link>

          {showDropDown && (
            <DropDown>
              <DropDownContent translate="translate(-200px, -10px)">
                <div onClick={handleSearchBox}>
                  <BsSearch />
                  <span>Search</span>
                </div>
                <div onClick={handleViewInfo}>
                  <BsInfoCircle />
                  <span>View Info</span>
                </div>
                <div>
                  <VscMute />
                  <span>Mute Notifications</span>
                </div>
                <div>
                  <MdOutlineWallpaper />
                  <span>Wallpaper</span>
                </div>
                <div>
                  <BsArchive />
                  <span>Archive</span>
                </div>
                {(!member.block.isBlock ||
                  (member.block.isBlock && member.isAdmin)) && (
                  <div onClick={handleBlock}>
                    <BiBlock />
                    <span>{member.block.isBlock ? "Unblock" : "Block"}</span>
                  </div>
                )}
                <div className="text-danger" onClick={deleteHandler}>
                  <RiDeleteBinLine />
                  <span>Delete</span>
                </div>
              </DropDownContent>
            </DropDown>
          )}
        </li>
      </MediaNav>
    </HeaderBar>
  );
};

export default ChatGroupHeader;
