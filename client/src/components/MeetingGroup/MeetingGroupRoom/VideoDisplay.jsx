import React, { useEffect, useRef } from "react";
import { Videos } from "../../Friends/MeetingRoom/MeetingRoom.styled";
import CommonPeer from "../../Friends/MeetingRoom/CommonPeer";

const VideoDisplay = ({
  name,
  avata,
  showTop,
  showVideo,
  stream,
  muteSound,
  isShare,
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
        <Videos isShowTop={showTop}>
          <video
            controls={isShare}
            ref={userVideo}
            muted={muteSound}
            playsInline={true}
            autoPlay={true}
          />
        </Videos>
      ) : (
        <>
          <CommonPeer
            font-size="18px"
            padding="5px 0"
            height="120px"
            width="120px"
            type="video-container"
            name={name}
            avata={avata}
          />
          <video ref={userVideo} muted={muteSound} autoPlay={true} />
        </>
      )}
    </>
  );
};

export default VideoDisplay;
