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
  return async (dispatch, getState) => {
    try {
      const {
        socket: { meetingSocket },
      } = getState();

      meetingSocket.emit(
        "meetingConnection",
        { callee, caller, room },
        async () => {
          dispatch(videoActions.setCallId({ callId: room }));
          await waitCallDone(callee, caller, room, dispatch);
          navigate(`/video-chat/Chats/meeting/${encodeURIComponent(room)}`);
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
};

export const answerCall = (userVideo, connectionRef) => {
  return async (dispatch, getState) => {
    try {
      const {
        video,
        socket: { meetingSocket },
      } = getState();
      console.log("answerCall video", video);

      dispatch(videoActions.setCallAccepted({ callAccepted: true }));

      const peer = new Peer({
        // initiator:false not initiating call just answering caller
        initiator: false,
        trickle: false,
        stream: video.stream,
      });

      peer.on("signal", (data) => {
        console.log("peer on signal answerCall running");
        meetingSocket.emit("answerCall", {
          signal: data,
          callId: video.callId,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("peer stream answerCall running");
        userVideo.current.srcObject = currentStream;
      });

      // video.call.signal is signal of caller
      peer.signal(video.call.signal);
      console.log("peer signal answerCall done");

      connectionRef.current = peer;
    } catch (err) {
      console.error(err);
    }
  };
};

export const callToUser = (userVideo, connectionRef) => {
  return async (dispatch, getState) => {
    try {
      console.log("current state callToUser", getState());

      const {
        video,
        socket: { meetingSocket },
      } = getState();

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: video.stream,
      });

      // Fired when the peer wants to send signaling data to the remote peer (always run)
      peer.on("signal", (data) => {
        console.log("peer on signal callToUser running");
        meetingSocket.emit("callToUser", {
          callId: video.callId,
          signalData: data,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("peer stream callToUser running");
        userVideo.current.srcObject = currentStream;
      });

      // Wait for user accept
      meetingSocket.on("callAccepted", (signal) => {
        dispatch(videoActions.setCallAccepted({ callAccepted: true }));

        // signal of callee answering to caller
        peer.signal(signal);
        console.log("peer signal callToUser done");
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
    connectionRef.current.on("error", (err) => {
      console.log(err);
    });

    dispatch(videoActions.setCallEnded({ callEnded: true }));

    // window.location.reload();
  };
};
