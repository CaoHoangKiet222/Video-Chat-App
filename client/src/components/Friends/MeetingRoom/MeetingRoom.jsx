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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { videoActions } from "../../../store/video-slice.jsx";
import { leaveCall } from "../../../store/video-creator.jsx";

const MeetingRoom = () => {
  const [showTop, setShowTop] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [showUserVideo, setShowUserVideo] = useState(true);
  const { callEnded, userStream, stream, call, peer } = useSelector(
    (state) => state.video
  );
  const myVideo = useRef(null),
    userVideo = useRef(null),
    peersRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);

  useEffect(() => {
    if (showTop) {
      const clearMainPeer = () => {
        peersRef.current.querySelectorAll(":scope > div").forEach((peer) => {
          peer.classList.remove("main-peer");
        });
      };

      peersRef.current.querySelectorAll(":scope > div").forEach((peer) => {
        peer.addEventListener("click", () => {
          clearMainPeer();
          peer.classList.add("main-peer");
          console.log("hello");
        });
      });
    }
  }, [showTop]);

  useEffect(() => {
    // useEffect for first time peer join into room
    if (stream) {
      myVideo.current.srcObject = stream;
    }
    if (userStream) {
      userVideo.current.srcObject = userStream;
    }
  }, [stream, userStream]);

  useEffect(() => {
    // useEffect allow videostream on or off
    if (showVideo) {
      myVideo.current.srcObject = stream;
    } else {
      myVideo.current.srcObject = null;
    }

    if (showUserVideo) {
      userVideo.current.srcObject = userStream;
    } else {
      userVideo.current.srcObject = null;
    }
  }, [showVideo, stream, showUserVideo, userStream]);

  useEffect(() => {
    meetingSocket.on("showUserVideo", () => {
      console.log("showUserVideo");
      setShowUserVideo(!showUserVideo);
    });

    return () => {
      meetingSocket.off("showUserVideo");
    };
  }, [meetingSocket, showUserVideo]);

  useEffect(() => {
    meetingSocket.on("callEnded", () => {
      dispatch(leaveCall(navigate, stream));
    });
  }, [dispatch, meetingSocket, navigate, stream]);

  const showTopControls = () => {
    if (showTop) {
      return setShowTop(false);
    }
    setShowTop(true);
  };

  const phoneOffHandle = () => {
    meetingSocket.emit("callEnded", { callId: params.meetingId });
  };

  const videoHandle = () => {
    meetingSocket.emit("showMyVideo", { callId: params.meetingId }, () => {
      setShowVideo(!showVideo);
    });
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
              <Peers ref={peersRef}>
                <CommonPeer
                  font-size="11px"
                  padding="1px 0"
                  height="40px"
                  width="40px"
                  type="peer-info"
                  user={call?.caller}
                  className="main-peer"
                />
                <CommonPeer
                  font-size="11px"
                  padding="1px 0"
                  height="40px"
                  width="40px"
                  type="peer-info"
                  user={call?.callee}
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
              user={call?.caller}
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
            <CommonControl onClick={videoHandle}>
              {showVideo ? <FiVideo /> : <FiVideoOff />}
            </CommonControl>
            <CommonControl>
              <HiOutlineMicrophone />
            </CommonControl>
            <CommonControl>
              <CgScreen />
            </CommonControl>
            <CommonControl className="close" onClick={phoneOffHandle}>
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
