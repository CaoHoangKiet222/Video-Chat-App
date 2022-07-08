import React, { useEffect, useState } from "react";
import { BiBlock, BiDotsVerticalRounded } from "react-icons/bi";
import { BsArchive, BsInfoCircle, BsSearch, BsTelephone } from "react-icons/bs";
import { MdOutlineWallpaper } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { VscMute } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
    console.log(onlineMems);
    if (onlineMems.length >= 1) {
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

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
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
                <a href="#" onClick={handleSearchBox}>
                  <BsSearch />
                  <span>Search</span>
                </a>
                <a href="#" onClick={handleViewInfo}>
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
                <a href="#">
                  <BiBlock />
                  <span>Block</span>
                </a>
                <a href="#" className="text-danger">
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

export default ChatGroupHeader;
