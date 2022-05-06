import React, { useState } from "react";
import {
  CommonControl,
  Container,
  Img,
  MeetingBottomControls,
  MeetingMain,
  MeetingTopControls,
  Name,
  PanelControl,
  PeerInfo,
  Peers,
  RemotePeer,
  Status,
  Streams,
  VideoContainer,
  Videos,
} from "./MeetingRoom.styled.jsx";
import {
  FiMenu,
  FiVideo,
  FiVideoOff,
  FiPhone,
  FiPhoneOff,
  FiUserPlus,
} from "react-icons/fi";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { CgScreen } from "react-icons/cg";
import { HiOutlineMicrophone } from "react-icons/hi";
import { RiFullscreenExitFill, RiFullscreenFill } from "react-icons/ri";
import { MdGridView } from "react-icons/md";
import { VscSplitHorizontal } from "react-icons/vsc";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import CommonPeer from "./CommonPeer.jsx";

const MeetingRoom = () => {
  const [showTop, setShowTop] = useState(false);

  const showTopControls = () => {
    console.log("hello");
    if (showTop) {
      return setShowTop(false);
    }
    setShowTop(true);
  };

  return (
    <Container>
      <MeetingMain>
        <MeetingTopControls className={`${!showTop ? "transparent" : ""}`}>
          {showTop && (
            <>
              <PanelControl>
                <FiMenu />
                <FaChevronLeft />
              </PanelControl>
              <Peers>
                <CommonPeer
                  font-size="11px"
                  padding="1px 0"
                  height="40px"
                  width="40px"
                  type="peer-info"
                />
              </Peers>
            </>
          )}
          <Videos isShowTop={showTop}>
            <video src=""></video>
          </Videos>
          {showTop && (
            <PanelControl>
              <FaChevronDown />
            </PanelControl>
          )}
        </MeetingTopControls>
        <Streams>
          <CommonPeer
            font-size="18px"
            padding="5px 0"
            height="120px"
            width="120px"
            type="video-container"
          />
          <MeetingBottomControls>
            <CommonControl>
              <FiVideo />
            </CommonControl>
            <CommonControl>
              <HiOutlineMicrophone />
            </CommonControl>
            <CommonControl>
              <CgScreen />
            </CommonControl>
            <CommonControl className="close">
              <FiPhoneOff />
            </CommonControl>
            <CommonControl>
              <FiUserPlus />
            </CommonControl>
            <CommonControl>
              <RiFullscreenExitFill />
              <RiFullscreenFill />
            </CommonControl>
            <CommonControl onClick={showTopControls}>
              {!showTop ? <MdGridView /> : <VscSplitHorizontal />}
            </CommonControl>
          </MeetingBottomControls>
        </Streams>
      </MeetingMain>
    </Container>
  );
};

export default MeetingRoom;
