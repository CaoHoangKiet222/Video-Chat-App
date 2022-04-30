import Peer from "simple-peer";
import { videoActions } from "./video-slice";

const waitCallDone = (callee, caller, room, dispatch) => {
  return new Promise((resolve, _reject) => {
    dispatch(
      videoActions.setCall({
        call: {
          callId: room,
          callee,
          caller,
          isReceiving: false,
          signal: null,
        },
      })
    );
    resolve();
  });
};

export const videoStart = (callee, caller, room, navigate) => {
  return async (dispatch) => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      dispatch(videoActions.setCallId({ callId: room }));

      await waitCallDone(callee, caller, room, dispatch);

      dispatch(videoActions.setStream({ currentStream }));

      navigate(`/video-chat/Chats/meeting/${encodeURIComponent(room)}`);

      // myVideo.current.srcObject = currentStream;
    } catch (err) {
      console.error(err);
    }
  };
};

export const answerCall = (socket, userVideo, connectionRef) => {
  return async (dispatch, getState) => {
    try {
      // console.log("current state", getState());

      const { video } = getState();

      dispatch(videoActions.setCallAccepted({ callAccepted: true }));

      const peer = new Peer({
        // initiator:false not initiating call just answering caller
        initiator: false,
        trickle: false,
        stream: video.stream,
      });

      peer.on("signal", (data) => {
        // console.log(data);
        socket.emit("answerCall", { signal: data, callId: video.callId });
      });

      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      peer.signal(video.call.signal);

      connectionRef.current = peer;
    } catch (err) {
      console.error(err);
    }
  };
};

export const callToUser = (socket, userVideo, connectionRef) => {
  return async (dispatch, getState) => {
    try {
      console.log("current state callToUser", getState());

      const {
        video,
        user: { user: caller },
      } = getState();

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: video.stream,
      });

      // Fired when the peer wants to send signaling data to the remote peer (always run)
      peer.on("signal", (data) => {
        socket.emit("callToUser", {
          callId: video.callId,
          signalData: data,
          caller,
        });
      });

      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      // Wait for user accept
      socket.on("callAccepted", (signal) => {
        dispatch(videoActions.setCallAccepted({ callAccepted: true }));

        peer.signal(signal);
      });

      connectionRef.current = peer;
    } catch (err) {
      console.error(err);
    }
  };
};

export const leaveCall = (connectionRef) => {
  return (dispatch) => {
    connectionRef.current.destroy();

    dispatch(videoActions.setCallEnded({ callEnded: true }));

    window.location.reload();
  };
};
