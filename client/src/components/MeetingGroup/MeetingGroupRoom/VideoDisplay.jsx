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

  useEffect(() => {
    if (showVideo || stream || showTop) {
      userVideo.current.srcObject = stream;
    }
  }, [stream, showVideo, showTop]);

  return (
    <>
      {showVideo && !showTop ? (
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
            displayText={
              !muteSound
                ? !showVideo
                  ? "Audio Only!"
                  : "Both Video and Audio"
                : muteSound && showVideo
                ? "Video Only!"
                : "Spectator!"
            }
          />
          <video
            ref={userVideo}
            muted={muteSound}
            autoPlay={true}
            controls={false}
          />
        </>
      )}
    </>
  );
};

export default VideoDisplay;
