import { postData } from "../utilities/utilities";
import { authActions } from "./auth-slice";
import { errorActions } from "./error-slice";
import { socketActions } from "./socket-slice";
import { userActions } from "./user-slice";
let timer;

export const fetchLogin = (url, user, type, navigate, signupRef) => {
  return async (dispatch, getState) => {
    dispatch(userActions.login({ user: null, isFetch: true, error: null }));

    try {
      const data = await postData(url, "post", {
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPass,
        rememberToLogin: user.isRemember,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(data);
      if (timer) {
        clearTimeout(timer);
      }

      if (type === "signup") {
        timer = setTimeout(() => {
          dispatch(
            userActions.login({ user: null, isFetch: false, error: null })
          );
          signupRef.current = false;
          navigate("/login");
        }, 50);
      } else {
        timer = setTimeout(() => {
          dispatch(
            userActions.login({
              user: { ...data },
              isFetch: false,
              error: null,
            })
          );
          getState().socket.notifySocket.emit("notifyingUserIsOnline", {
            userId: data._id,
          });
        }, 50);
      }
    } catch (error) {
      console.log(error);
      timer = setTimeout(() => {
        dispatch(
          userActions.login({
            user: null,
            isFetch: false,
            error: error.message,
          })
        );
      }, 50);
    }
  };
};

// export const fetchSession = (url, navigate) => {
//   return async (dispatch, getState) => {
//     try {
//       const response = await fetch(url, { credentials: "include" });
//       const { isRemember } = await response.json();
//       const { chatSocket, meetingSocket, notifySocket } = getState().socket;
//       if (isRemember) {
//         setTimeout(() => {
//           navigate("/video-chat/Chats");
//         }, 50);
//         dispatch(userActions.setIsFetch({ isFetch: true }));
//       } else {
//         if (chatSocket && meetingSocket && notifySocket) {
//           notifySocket.emit("notifyingUserIsOffline");
//
//           dispatch(socketActions.disconnectSocket());
//         }
//
//         dispatch(socketActions.setupSocket());
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
// };

export const userLogout = (url, userId, navigate) => {
  return async (dispatch, getState) => {
    try {
      const response = await postData(url, "post", { userId });
      const { notifySocket } = getState().socket;
      console.log(response);

      if (!response.error) {
        dispatch(authActions.setAuth({ auth: false }));
        dispatch(userActions.logout());

        navigate("/login");

        notifySocket.emit("notifyingUserIsOffline");

        dispatch(socketActions.disconnectSocket());
      }
    } catch (error) {
      dispatch(errorActions.setError({ error: true, message: error.message }));
    }
  };
};
