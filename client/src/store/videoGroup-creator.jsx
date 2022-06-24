import Peer from "simple-peer";

export const createPeerForCallee = (
  userAlreadyInRoomId,
  calleeId,
  stream,
  meetingGroupSocket,
  setStreams
) => {
  // We need to create peer(initiator: true) for callee to send signal to
  // users(caller and other callees) already waiting in room
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    meetingGroupSocket.emit("sendingSignal", {
      userAlreadyInRoomId,
      calleeId,
      signal,
    });
  });

  peer.on("stream", (currentStream) => {
    setStreams((preStreams) => [
      ...preStreams,
      { stream: currentStream, peerId: userAlreadyInRoomId },
    ]);
  });

  return peer;
};

export const addPeerForJoinedUsers = (
  incomingSignal,
  userJoinId,
  stream,
  meetingGroupSocket,
  setStreams
) => {
  // Other users already in room add peer of callee join
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    meetingGroupSocket.emit("returningSignal", {
      userJoinId,
      signal,
    });
  });

  peer.on("stream", (currentStream) => {
    setStreams((preStreams) => [
      ...preStreams,
      { stream: currentStream, peerId: userJoinId },
    ]);
  });

  peer.signal(incomingSignal);

  return peer;
};

export const leaveGroupCall = (navigate, stream, reload = false) => {
  stream?.getTracks().forEach(function (track) {
    track.stop();
  });

  navigate("/video-chat/Chats");

  reload && window.location.reload();
};
