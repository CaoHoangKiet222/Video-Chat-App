import Peer from "simple-peer";
import { getUserMedia } from "../utilities/utilities";
import { errorActions } from "./error-slice";
import { timeCallActions } from "./timecall-slice";
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

export const beforeStartVideo = (
  type,
  member,
  user,
  room,
  navigate,
  error,
  isReceiving
) => {
  return async (dispatch) => {
    switch (type) {
      case "Caller": {
        await getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            console.log(currentStream);
            dispatch(videoActions.setStream({ currentStream }));
          })
          .catch((err) => {
            console.log(err);
            error.current = err.message;
            dispatch(
              errorActions.setError({
                error: true,
                message: err.message,
              })
            );
            console.log(error);
          });

        if (!error.current) {
          return dispatch(videoStart(member, user, room, navigate));
        }

        error.current = null;
        break;
      }
      default: {
        getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            console.log(currentStream);
            dispatch(videoActions.setStream({ currentStream }));
          })
          .catch((err) => {
            console.log(err);
            // dispatch(videoActions.setError({ error: err }));
            dispatch(
              errorActions.setError({
                error: true,
                message: err.message,
              })
            );
          });
        dispatch(videoActions.setCallId({ callId: room }));
        dispatch(
          videoActions.setCall({
            call: {
              callee: member,
              caller: user,
              isReceiving,
            },
          })
        );
        navigate(`/video-chat/Chats/meeting/${encodeURIComponent(room)}`);
        break;
      }
    }
  };
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

export const answerCall = (call, type) => {
  return async (dispatch, getState) => {
    try {
      const {
        video,
        socket: { meetingSocket },
      } = getState();
      console.log("answerCall video", video);

      dispatch(videoActions.setCallAccepted({ callAccepted: true }));

      dispatch(videoActions.setType({ type }));

      const peer = new Peer({
        // initiator:false not initiating call just answering caller
        initiator: false,
        trickle: false,
        stream: video.stream,
      });

      peer.on("signal", (data) => {
        console.log("peer on signal answerCall running");
        meetingSocket.emit(
          "answerCall",
          {
            signal: data,
            callId: video.callId,
            call,
          },
          () => {
            dispatch(timeCallActions.setTimeCall({ timeCall: call.startCall }));
          }
        );
      });

      peer.on("stream", (currentStream) => {
        console.log("peer stream answerCall running");

        dispatch(videoActions.setUserStream({ userStream: currentStream }));
      });

      // video.call.signal is signal of caller
      peer.signal(video.call.signal);
      console.log("peer signal answerCall done");

      dispatch(videoActions.setPeer({ peer }));
    } catch (err) {
      console.error(err);
    }
  };
};

export const callToUser = () => {
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
        dispatch(videoActions.setUserStream({ userStream: currentStream }));
      });

      // Wait for user accept
      meetingSocket.on("callAccepted", (signal, timeStart) => {
        dispatch(videoActions.setCallAccepted({ callAccepted: true }));

        dispatch(timeCallActions.setTimeCall({ timeCall: timeStart }));
        // signal of callee answering to caller
        peer.signal(signal);
        console.log("peer signal callToUser done");
      });

      dispatch(videoActions.setPeer({ peer }));
    } catch (err) {
      console.error(err);
    }
  };
};

export const leaveCall = (navigate, stream, reload = false) => {
  return (dispatch) => {
    stream?.getTracks().forEach(function (track) {
      track.stop();
    });

    navigate("/video-chat/Chats");

    dispatch(videoActions.setStateAgain());

    reload && window.location.reload();
  };
};