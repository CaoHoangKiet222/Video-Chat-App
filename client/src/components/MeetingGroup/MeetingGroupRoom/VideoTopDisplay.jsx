import React, { useEffect, useRef } from "react";
import { Videos } from "../../Friends/MeetingRoom/MeetingRoom.styled";
import CommonPeer from "../../Friends/MeetingRoom/CommonPeer";

const VideoTopDisplay = ({
  name,
  avata,
  showTop,
  showVideo,
  stream,
  muteSound,
}) => {
  const userVideo = useRef(null);
  console.log(name, avata, showVideo);

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
            ref={userVideo}
            muted={muteSound}
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
            avata={avata}
            className="main-peer"
          />
          <video ref={userVideo} muted={muteSound} autoPlay={true} />
        </>
      )}
    </>
  );
};

export default VideoTopDisplay;
