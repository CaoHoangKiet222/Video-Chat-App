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
// import CommonPeer from "./CommonPeer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { leaveCall } from "../../../store/video-creator.jsx";
import {
  formatCallTime,
  shareScreen,
  findImgAndNameGroup,
} from "../../../utilities/utilities.jsx";
import {
  addPeerForJoinedUsers,
  createPeerForCallee,
  leaveGroupCall,
} from "../../../store/videoGroup-creator";
import VideoDisplay from "./VideoDisplay";
import CommonPeer from "../../Friends/MeetingRoom/CommonPeer";

const MeetingGroupRoom = () => {
  const [showTop, setShowTop] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showUserVideo, setShowUserVideo] = useState(false);
  const [changeScale, setChangeScale] = useState(false);
  const [muteSound, setMuteSound] = useState(false);
  const [toggleIconSound, setToggleIconSound] = useState(false);
  // const [peers, setPeers] = useState([]);
  const [streams, setStreams] = useState([]);
  const myVideo = useRef(null),
    peersRef = useRef([]);
  const params = useParams();
  const navigate = useNavigate();
  const meetingGroupSocket = useSelector(
    (state) => state.socket.meetingGroupSocket
  );
  // const timeCall = useSelector((state) => state.timeCall.timeCall);
  const groupImg = null,
    groupName = null;
  // const conversation = useSelector((state) => state.conversation.conversation);
  // const { groupName, groupImg } = findImgAndNameGroup(
  //   conversation?.conv,
  //   params.meetingId
  // );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        const calleeSocketId = meetingGroupSocket.id;

        meetingGroupSocket.emit("joinVideoGroup", { room: params.meetingId });

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
              peerToUserId: userAlreadyInRoomId,
            });

            peers.push(peer);
          });

          // setPeers(peers);
        });

        meetingGroupSocket.on("userJoined", ({ signal, calleeId }) => {
          const peer = addPeerForJoinedUsers(
            signal,
            calleeId,
            stream,
            meetingGroupSocket,
            setStreams
          );

          peersRef.current.push({
            receivingPeerId: calleeId,
            peer,
          });

          // setPeers((prePeers) => [...prePeers, peer]);
        });

        meetingGroupSocket.on("receivingSignal", ({ signal, userInRoomId }) => {
          const { peer } = peersRef.current.find(
            ({ peerToUserId }) => peerToUserId === userInRoomId
          );

          peer.signal(signal);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [meetingGroupSocket, params.meetingId]);

  const showTopControls = () => {
    setShowTop(!showTop);
  };

  const phoneOffHandle = () => {
    leaveGroupCall(navigate, myVideo.current.srcObject, true);
  };

  const videoHandle = () => {};

  const changeScaleHandle = () => {
    setChangeScale(!changeScale);
  };

  const toggleSound = () => {
    setToggleIconSound(!toggleIconSound);
    // meetingSocket.emit("toggleSound", { callId: params.meetingId });
  };

  const handleShareScreen = () => {};

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
          groupImg={groupImg}
          groupName={groupName}
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
                {/* <FaChevronLeft /> */}
              </PanelControl>
              <Peers>
                {streams.map((stream, index) => {
                  return (
                    <VideoDisplay
                      key={index}
                      showTop={showTop}
                      stream={stream}
                    />
                  );
                })}
                {/* {showUserVideo ? ( */}
                {/*   <Videos isShowTop={showTop}> */}
                {/*     <video */}
                {/*       ref={userTopVideo} */}
                {/*       muted={true} */}
                {/*       playsInline={true} */}
                {/*       autoPlay={true} */}
                {/*     /> */}
                {/*   </Videos> */}
                {/* ) : ( */}
                {/*   <CommonPeer */}
                {/*     font-size="11px" */}
                {/*     padding="1px 0" */}
                {/*     height="40px" */}
                {/*     width="40px" */}
                {/*     type="peer-info" */}
                {/*     user={call.isReceiving ? call.caller : call.callee} */}
                {/*     className="main-peer" */}
                {/*   /> */}
                {/* )} */}
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
        <Streams
          changeScale={changeScale}
          showUserVideo={showUserVideo}
          showTop={showTop}
        >
          {/* {returnPeer(call, userVideo, showTop, showUserVideo, muteSound)} */}

          <CommonPeer
            font-size="18px"
            padding="5px 0"
            height="120px"
            width="120px"
            type="video-container"
            groupImg={groupImg}
            groupName={groupName}
          />

          <MeetingBottomControls>
            <CommonControl onClick={videoHandle}>
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

export default MeetingGroupRoom;
