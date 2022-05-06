import React from "react";
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

const MeetingRoom = () => {
  const showTopControls = () => {};
  return (
    <Container>
      <MeetingMain>
        <MeetingTopControls>
          <PanelControl>
            <FiMenu />
            <FaChevronLeft />
          </PanelControl>
          <Peers>
            <PeerInfo className="main-peer">
              <RemotePeer>
                <Name font-size="11px" padding="1px 0">
                  Cao Hoang Kiet
                </Name>
                <Img height="40px" width="40px">
                  <img src="http://localhost:3000/images/user.jpg" alt="" />
                </Img>
                <Status font-size="11px" padding="1px 0">
                  spectator
                </Status>
              </RemotePeer>
            </PeerInfo>
            <PeerInfo className="main-peer">
              <RemotePeer>
                <Name font-size="11px" padding="1px 0">
                  Cao Hoang Kiet
                </Name>
                <Img height="40px" width="40px">
                  <img src="http://localhost:3000/images/user.jpg" alt="" />
                </Img>
                <Status font-size="11px" padding="1px 0">
                  spectator
                </Status>
              </RemotePeer>
            </PeerInfo>
          </Peers>
          <Videos>
            <video src=""></video>
          </Videos>
          <PanelControl>
            <FaChevronDown />
          </PanelControl>
        </MeetingTopControls>
        <Streams>
          <VideoContainer>
            <RemotePeer>
              <Name font-size="18px" padding="5px 0">
                Cao Hoang Kiet
              </Name>
              <Img height="120px" width="120px">
                <img src="http://localhost:3000/images/user.jpg" alt="" />
              </Img>
              <Status font-size="18px" padding="5px 0">
                spectator
              </Status>
            </RemotePeer>
          </VideoContainer>
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
              <MdGridView />
              <VscSplitHorizontal />
            </CommonControl>
          </MeetingBottomControls>
        </Streams>
      </MeetingMain>
    </Container>
  );
};

export default MeetingRoom;
