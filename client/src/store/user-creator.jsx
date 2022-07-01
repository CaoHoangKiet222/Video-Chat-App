import Swal from "sweetalert2";
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
        if (data.twoFA.is2FAEnabled) {
          dispatch(userActions.setIsFetch({ isFetch: false }));
          Swal.fire({
            icon: "success",
            html: "Correct login information, we will show <strong>2-factor authentication input token</strong> after this message.",
            showConfirmButton: false,
            timer: 2000,
          }).then(async () => {
            try {
              while (true) {
                const result = await Swal.fire({
                  title: "Submit your token",
                  input: "number",
                  inputPlaceholder: "6-digits",
                  inputAttributes: {
                    autocapitalize: "off",
                  },
                  showCancelButton: true,
                  confirmButtonText: "Submit",
                  showLoaderOnConfirm: true,
                  backdrop: true,
                  preConfirm: (otpToken) => {
                    return postData(
                      `${process.env.REACT_APP_ENDPOINT_SERVER}/verify-2fa`,
                      "post",
                      {
                        otpToken,
                        userSecret: data.twoFA.secret,
                      }
                    ).catch((error) => {
                      Swal.showValidationMessage(`Request failed: ${error}`);
                    });
                  },
                  allowOutsideClick: () => !Swal.isLoading(),
                });
                if (result.isDismissed) {
                  break;
                }

                if (result.value.isValid) {
                  await Swal.fire({
                    icon: "success",
                    html: "Token valid, security layer 2 authentication completed!",
                    showConfirmButton: false,
                    timer: 2000,
                  });

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
                  break;
                } else {
                  await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: "Invalid Token!!",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }
              }
            } catch (error) {
              console.log(error);
            }
          });
        } else {
          dispatch(userActions.setIsFetch({ isFetch: false }));
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
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(
        userActions.login({
          user: null,
          isFetch: false,
          error: error.message,
        })
      );
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
