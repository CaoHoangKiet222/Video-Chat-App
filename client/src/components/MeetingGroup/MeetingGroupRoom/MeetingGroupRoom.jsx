import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "../../Friends/MeetingRoom/MeetingRoom.styled";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  formatCallTime,
  shareScreen,
  findImgAndNameGroup,
  toggleAttributePeers,
  shareGroupScreen,
  splicePeers,
  replacePeersTrack,
} from "../../../utilities/utilities.jsx";
import {
  addPeerForJoinedUsers,
  createPeerForCallee,
  leaveGroupCall,
} from "../../../store/videoGroup-creator";
import VideoDisplay from "./VideoDisplay";
import Notification from "../../UI/Notification";
import { errorActions } from "../../../store/error-slice";
import VideoTopDisplay from "./VideoTopDisplay";

const MeetingGroupRoom = () => {
  const [showTop, setShowTop] = useState(false);
  const [changeScale, setChangeScale] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [toggleIconSound, setToggleIconSound] = useState(true);
  const [streams, setStreams] = useState([]);
  const [peers, setPeers] = useState([]);
  const myVideo = useRef(null),
    peersRef = useRef([]),
    shareStreamRef = useRef(null);
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [showMyVideo, setShowMyVideo] = useState(
    searchParams.get("showVideo") === "true"
  );
  const [myStream, setMyStream] = useState(null);
  const navigate = useNavigate();
  const meetingGroupSocket = useSelector(
    (state) => state.socket.meetingGroupSocket
  );
  const { error, message } = useSelector((state) => state.error);
  // const timeCall = useSelector((state) => state.timeCall.timeCall);

  // const calleeInfo = useMemo(() => {
  //   return {
  //     name: "kkkkkkkkkkkk",
  //     avatar: "/images/user.jpg",
  //   };
  // }, []);

  const { user: calleeInfo } = useSelector((state) => state.user);

  console.log(peers);
  console.log(peersRef);
  console.log(streams);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);

        const calleeSocketId = meetingGroupSocket.id;

        meetingGroupSocket.emit("joinVideoGroup", {
          room: params.meetingId,
          user: {
            ...calleeInfo,
            showVideo: searchParams.get("showVideo") === "true",
            muteSound: true,
            isShare: false,
          },
        });

        meetingGroupSocket.on("allUsers", (users) => {
          const peers = [];
          users.forEach((userAlreadyInRoomId) => {
            const peer = createPeerForCallee(
              userAlreadyInRoomId,
              calleeSocketId,
              stream,
              meetingGroupSocket,
              setStreams
            );

            peersRef.current.push({
              peer,
              peerId: userAlreadyInRoomId,
            });

            peers.push({
              peer,
              peerId: userAlreadyInRoomId,
            });
          });

          setPeers(peers);
        });

        meetingGroupSocket.on(
          "userJoined",
          ({ signal, userJoinId, userJoinInfo }) => {
            const peer = addPeerForJoinedUsers(
              signal,
              userJoinId,
              stream,
              meetingGroupSocket,
              setStreams
            );

            peersRef.current.push({
              peerId: userJoinId,
              peer,
            });

            setPeers((prePeers) => [
              ...prePeers,
              {
                peerId: userJoinId,
                peer,
                ...userJoinInfo,
              },
            ]);
          }
        );

        meetingGroupSocket.on(
          "receivingSignal",
          ({ signal, userInRoomId, userInRoomInfo }) => {
            const { peer } = peersRef.current.find(
              ({ peerId }) => peerId === userInRoomId
            );

            peer.signal(signal);
            console.log(userInRoomInfo);
            setPeers((prePeers) => {
              prePeers.splice(
                prePeers.findIndex(({ peerId }) => peerId === userInRoomId),
                1,
                {
                  peerId: userInRoomId,
                  peer,
                  ...userInRoomInfo,
                }
              );
              return [...prePeers];
            });
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [meetingGroupSocket, params.meetingId, calleeInfo, searchParams]);

  useEffect(() => {
    myVideo.current.srcObject = showMyVideo ? myStream : null;
  }, [showMyVideo, myStream]);

  useEffect(() => {
    let timer = 0;
    if (error) {
      timer = setTimeout(() => {
        dispatch(errorActions.resetError({ error: false }));
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [error, dispatch]);

  useEffect(() => {
    meetingGroupSocket.on("userLeaving", ({ userLeaveId, user }) => {
      dispatch(
        errorActions.setError({
          error: true,
          message: user?.name + " has leaved the room",
        })
      );

      setStreams((preStreams) => [...splicePeers(preStreams, userLeaveId)]);

      peersRef.current = splicePeers(peersRef.current, userLeaveId);

      setPeers((prePeers) => [...splicePeers(prePeers, userLeaveId)]);
    });

    return () => {
      meetingGroupSocket.off("userLeaving");
    };
  }, [meetingGroupSocket, streams, dispatch]);

  useEffect(() => {
    meetingGroupSocket.on("showUserVideo", ({ userId }) => {
      console.log("showUserVideo", userId);

      setPeers((prePeers) => {
        return [...toggleAttributePeers(prePeers, userId, "showVideo")];
      });
    });

    meetingGroupSocket.on("toggleSound", ({ userId }) => {
      console.log("toggleSound", userId);

      setPeers((prePeers) => {
        return [...toggleAttributePeers(prePeers, userId, "muteSound")];
      });
    });

    meetingGroupSocket.on("toggleControls", ({ userId }) => {
      console.log("toggleControls", userId);

      setPeers((prePeers) => {
        return [...toggleAttributePeers(prePeers, userId, "isShare")];
      });
    });
  }, [meetingGroupSocket]);

  useEffect(() => {
    // if another user join while someone is sharing run it to render again
    if (isShare && shareStreamRef.current && peers) {
      replacePeersTrack(
        shareStreamRef.current,
        myStream,
        peersRef.current,
        setIsShare,
        meetingGroupSocket,
        params.meetingId
      );
    }
  }, [isShare, myStream, peers, meetingGroupSocket, params.meetingId]);

  const showTopControls = () => {
    setShowTop(!showTop);
  };

  const phoneOffHandle = () => {
    meetingGroupSocket.emit("leaveGroupRoom", {
      user: calleeInfo,
      userLeaveId: meetingGroupSocket.id,
      room: params.meetingId,
    });
    leaveGroupCall(navigate, myVideo.current.srcObject);
  };

  const videoHandle = () => {
    setShowMyVideo(!showMyVideo);
    meetingGroupSocket.emit("showMyVideo", { room: params.meetingId });
  };

  const changeScaleHandle = () => {
    setChangeScale(!changeScale);
  };

  const toggleSound = () => {
    setToggleIconSound(!toggleIconSound);
    meetingGroupSocket.emit("toggleSound", { room: params.meetingId });
  };

  const handleShareScreen = () => {
    setIsShare(true);
    meetingGroupSocket.emit("toggleControls", { room: params.meetingId });
    shareGroupScreen(
      myStream,
      peersRef.current,
      setIsShare,
      shareStreamRef,
      meetingGroupSocket,
      params.meetingId
    );
  };

  return (
    <Container>
      <MeetingMain>
        <MeetingTopControls className={`${!showTop ? "transparent" : ""}`}>
          <Notification text={message} active={error ? true : false} />
          {showTop && (
            <>
              <PanelControl>
                <FiMenu />
                {/* <FaChevronLeft /> */}
              </PanelControl>
              <Peers showTop={showTop}>
                {streams.map(({ stream, peerId }, index) => {
                  const { name, showVideo, avatar, muteSound, isShare } =
                    peers.find((peer) => peer.peerId === peerId);
                  return (
                    <VideoTopDisplay
                      key={index}
                      showTop={showTop}
                      stream={stream}
                      muteSound={muteSound}
                      showVideo={showVideo}
                      name={name}
                      avatar={avatar}
                      isShare={isShare}
                    />
                  );
                })}
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
        <Streams isGroup={true} changeScale={changeScale} showTop={showTop}>
          {streams.map(({ stream, peerId }, index) => {
            const { name, showVideo, avatar, muteSound, isShare } = peers.find(
              (peer) => peer.peerId === peerId
            );
            console.log(isShare);

            return (
              <VideosWrapper key={index}>
                <VideoStyle showVideo={showVideo} showTop={showTop}>
                  <VideoDisplay
                    showTop={showTop}
                    stream={stream}
                    muteSound={muteSound}
                    showVideo={showVideo}
                    name={name}
                    avatar={avatar}
                    isShare={isShare}
                  />
                </VideoStyle>
              </VideosWrapper>
            );
          })}

          <MeetingBottomControls>
            <CommonControl onClick={videoHandle}>
              {showMyVideo ? <FiVideo /> : <FiVideoOff />}
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

export default MeetingGroupRoom;
