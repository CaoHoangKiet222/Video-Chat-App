import React, { useEffect, useRef, useState } from "react";
import { Videos } from "../../Friends/MeetingRoom/MeetingRoom.styled";

const VideoDisplay = ({ showTop, stream }) => {
  const userVideo = useRef(null);

  useEffect(() => {
    console.log(stream);
    userVideo.current.srcObject = stream;
  }, [stream]);

  return (
    <Videos isShowTop={showTop}>
      <video ref={userVideo} muted={true} playsInline={true} autoPlay={true} />
    </Videos>
  );
};

export default VideoDisplay;
