import React, { useEffect, useRef } from "react";
import { Videos } from "../../Friends/MeetingRoom/MeetingRoom.styled";
import CommonPeer from "../../Friends/MeetingRoom/CommonPeer";

const VideoTopDisplay = ({
  name,
  avatar,
  showTop,
  showVideo,
  stream,
  muteSound,
  isShare,
}) => {
  const userVideo = useRef(null);

  useEffect(() => {
    if (showVideo || stream) {
      userVideo.current.srcObject = stream;
    }
  }, [stream, showVideo]);

  return (
    <>
      {showVideo ? (
        <Videos isShowTop={showTop} topDisplay={true}>
          <video
            controls={isShare}
            ref={userVideo}
            muted={true}
            playsInline={true}
            autoPlay={true}
          />
        </Videos>
      ) : (
        <>
          <CommonPeer
            font-size="11px"
            padding="1px 0"
            height="40px"
            width="40px"
            type="peer-info"
            name={name}
            avatar={avatar}
            className="main-peer"
            displayText={muteSound ? "Spectator!" : "Audio Only!"}
          />
          <video
            ref={userVideo}
            muted={true}
            autoPlay={true}
            controls={false}
          />
        </>
      )}
    </>
  );
};

export default VideoTopDisplay;
