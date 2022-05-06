import React, { useEffect, useRef, useState } from "react";
import {
  CommonControl,
  Container,
  MeetingBottomControls,
  MeetingMain,
  MeetingTopControls,
  PanelControl,
  Peers,
  Streams,
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
import { useSelector } from "react-redux";

const MeetingRoom = () => {
  const [showTop, setShowTop] = useState(false);
  const {
    callEnded,
    userStream,
    stream,
    // call: { caller, callee },
  } = useSelector((state) => state.video);
  const myVideo = useRef(null),
    userVideo = useRef(null);

  useEffect(() => {
    if (stream) {
      myVideo.current.srcObject = stream;
    }

    if (userStream) {
      userVideo.current.srcObject = userStream;
    }
  }, [stream, userStream]);

  const showTopControls = () => {
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
            <video
              ref={myVideo}
              muted={true}
              playsInline={true}
              autoPlay={true}
            />
          </Videos>
          {showTop && (
            <PanelControl>
              <FaChevronDown />
            </PanelControl>
          )}
        </MeetingTopControls>
        <Streams>
          {callEnded ? (
            <CommonPeer
              font-size="18px"
              padding="5px 0"
              height="120px"
              width="120px"
              type="video-container"
            />
          ) : (
            <video
              ref={userVideo}
              muted={true}
              playsInline={true}
              autoPlay={true}
            />
          )}
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
