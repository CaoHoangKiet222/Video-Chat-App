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
  VideoStyle,
  VideosWrapper,
} from "./MeetingRoom.styled.jsx";
import {
  FiMenu,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
  FiUserPlus,
} from "react-icons/fi";
import { BiMicrophoneOff } from "react-icons/bi";
import { CgScreen } from "react-icons/cg";
import { HiOutlineMicrophone } from "react-icons/hi";
import { RiFullscreenExitFill, RiFullscreenFill } from "react-icons/ri";
import { MdGridView } from "react-icons/md";
import { VscSplitHorizontal } from "react-icons/vsc";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import CommonPeer from "./CommonPeer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { leaveCall } from "../../../store/video-creator.jsx";
import { formatCallTime, shareScreen } from "../../../utilities/utilities.jsx";

const MeetingRoom = () => {
  const [showTop, setShowTop] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showUserVideo, setShowUserVideo] = useState(false);
  const [changeScale, setChangeScale] = useState(false);
  const [muteSound, setMuteSound] = useState(false);
  const [toggleIconSound, setToggleIconSound] = useState(false);
  const { userStream, stream, call, peer, type } = useSelector(
    (state) => state.video
  );
  const myVideo = useRef(null),
    userVideo = useRef(null),
    userTopVideo = useRef(),
    peersRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingSocket = useSelector((state) => state.socket.meetingSocket);
  const timeCall = useSelector((state) => state.timeCall.timeCall);
  const [isClickFirstTime, setIsClickFirstTime] = useState(false);

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
        });
      });
    }
  }, [showTop]);

  useEffect(() => {
    // Callee startCall
    if (call.isReceiving && !isClickFirstTime) {
      meetingSocket.emit(
        "showMyVideo",
        { callId: params.meetingId, type, isClickFirstTime },
        () => {
          setIsClickFirstTime(true);
          if (type === "video") {
            return setShowVideo(true);
          }
          setShowVideo(false);
        }
      );
    }
  }, [
    call.isReceiving,
    meetingSocket,
    params.meetingId,
    type,
    isClickFirstTime,
  ]);

  useEffect(() => {
    // Caller startCall
    if (isClickFirstTime) {
      return meetingSocket.off("startVideoOrPhone");
    }

    meetingSocket.on("startPhone", () => {
      setIsClickFirstTime(true);
      setShowUserVideo(false);
    });
  }, [meetingSocket, isClickFirstTime]);

  useEffect(() => {
    // useEffect allow videostream on or off
    if (myVideo.current) {
      myVideo.current.srcObject = showVideo ? stream : null;
    }

    if (userVideo.current) {
      userVideo.current.srcObject =
        showUserVideo || !muteSound ? userStream : null;
    }

    if (userTopVideo.current) {
      userTopVideo.current.srcObject = showUserVideo ? userStream : null;
    }
  }, [showVideo, stream, showUserVideo, userStream, showTop, muteSound]);

  useEffect(() => {
    // if (isClickFirstTime ) {
    meetingSocket.on("showUserVideo", () => {
      setShowUserVideo(!showUserVideo);
    });
    // }

    return () => {
      meetingSocket.off("showUserVideo");
    };
  }, [meetingSocket, showUserVideo]);

  useEffect(() => {
    meetingSocket.on("toggleSound", () => {
      setMuteSound(!muteSound);
    });

    return () => {
      meetingSocket.off("toggleSound");
    };
  }, [meetingSocket, muteSound]);

  useEffect(() => {
    meetingSocket.on("callEnded", () => {
      // dispatch(leaveCall(navigate, stream, true));
      dispatch(leaveCall(navigate, stream));
    });
  }, [dispatch, meetingSocket, navigate, stream]);

  const showTopControls = () => {
    setShowTop(!showTop);
  };

  const phoneOffHandle = () => {
    meetingSocket.emit("callEnded", {
      callId: params.meetingId,
      callTime: formatCallTime(timeCall),
      callerId: call.caller._id,
      calleeId: call.callee._id,
      startCall: timeCall,
    });
  };

  const videoHandle = () => {
    // dispatch(videoActions.setType({ type: "video" }));
    meetingSocket.emit(
      "showMyVideo",
      { callId: params.meetingId, isClickFirstTime },
      () => {
        // setIsClickFirstTime(true);
        setShowVideo(!showVideo);
      }
    );
  };

  const changeScaleHandle = () => {
    setChangeScale(!changeScale);
  };

  const toggleSound = () => {
    setToggleIconSound(!toggleIconSound);
    meetingSocket.emit("toggleSound", { callId: params.meetingId });
  };

  const handleShareScreen = () => {
    shareScreen(stream, peer);
  };

  const returnPeer = (call, userVideo, showTop, showUserVideo, muteSound) => {
    return showUserVideo && !showTop ? (
      <video
        ref={userVideo}
        muted={muteSound}
        playsInline={true}
        autoPlay={true}
      />
    ) : (
      <>
        <CommonPeer
          font-size="18px"
          padding="5px 0"
          height="120px"
          width="120px"
          type="video-container"
          user={call.isReceiving ? call.caller : call.callee}
          displayText={
            !muteSound
              ? !showUserVideo
                ? "Audio Only!"
                : "Both Video and Audio"
              : muteSound && showUserVideo
              ? "Video Only!"
              : "Spectator!"
          }
        />
        <video ref={userVideo} muted={muteSound} autoPlay={true} />
      </>
    );
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
                {showUserVideo ? (
                  <Videos isShowTop={showTop}>
                    <video
                      ref={userTopVideo}
                      muted={true}
                      playsInline={true}
                      autoPlay={true}
                    />
                  </Videos>
                ) : (
                  <CommonPeer
                    font-size="11px"
                    padding="1px 0"
                    height="40px"
                    width="40px"
                    type="peer-info"
                    user={call.isReceiving ? call.caller : call.callee}
                    className="main-peer"
                    displayText={muteSound ? "Spectator!" : "Audio Only!"}
                  />
                )}
              </Peers>
            </>
          )}

          <Videos isShowTop={showTop}>
            {showVideo && (
              <video
                ref={myVideo}
                muted={true}
                playsInline={true}
                autoPlay={true}
              />
            )}
          </Videos>
          {showTop && (
            <PanelControl>
              <FaChevronDown />
            </PanelControl>
          )}
        </MeetingTopControls>
        <Streams
          changeScale={changeScale}
          showUserVideo={showUserVideo}
          showTop={showTop}
        >
          <VideosWrapper isSingle={true} changeScale={changeScale}>
            <VideoStyle
              isSingle={true}
              showUserVideo={showUserVideo}
              showTop={showTop}
            >
              {returnPeer(call, userVideo, showTop, showUserVideo, muteSound)}
            </VideoStyle>
          </VideosWrapper>

          <MeetingBottomControls>
            <CommonControl onClick={videoHandle}>
              {/* {type === "phone" ? ( */}
              {/*   <FiVideoOff /> */}
              {/* ) : showVideo ? ( */}
              {/*   <FiVideo /> */}
              {/* ) : ( */}
              {/*   <FiVideoOff /> */}
              {/* )} */}
              {showVideo ? <FiVideo /> : <FiVideoOff />}
            </CommonControl>
            <CommonControl onClick={toggleSound}>
              {!toggleIconSound ? <HiOutlineMicrophone /> : <BiMicrophoneOff />}
            </CommonControl>
            <CommonControl onClick={handleShareScreen}>
              <CgScreen />
            </CommonControl>
            <CommonControl className="close" onClick={phoneOffHandle}>
              <FiPhoneOff />
            </CommonControl>
            <CommonControl>
              <FiUserPlus />
            </CommonControl>
            <CommonControl onClick={changeScaleHandle}>
              {changeScale ? <RiFullscreenExitFill /> : <RiFullscreenFill />}
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
