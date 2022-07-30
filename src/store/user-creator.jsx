import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { authFirebase } from "../utilities/firebase";
import { postData } from "../utilities/utilities";
import { authActions } from "./auth-slice";
import { socketActions } from "./socket-slice";
import { userActions } from "./user-slice";

export const fetchLogin = (
  url,
  user,
  type,
  navigate,
  signupRef,
  passResetRef,
  resetAllUseState
) => {
  return async (dispatch) => {
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

      if (type !== "login") {
        if (type === "password-reset" || type === "new-password") {
          passResetRef.current = false;
        } else if (type === "signup") {
          signupRef.current = false;
        }
        dispatch(
          userActions.login({ user: null, isFetch: false, error: null })
        );

        if (data.error) {
          throw new Error(data.error);
        }

        Swal.fire({
          icon: "success",
          html: data.message,
          showConfirmButton: true,
          allowOutsideClick: false,
        }).then(() => {
          if (type === "signup") {
            navigate("/login");
          }
          resetAllUseState();
        });
      } else {
        handleTwoFA(data, dispatch, navigate);
      }
    } catch (error) {
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

export const fetchLoginByFirebase = (url, user, provider, navigate) => {
  return async (dispatch) => {
    dispatch(userActions.login({ user: null, isFetch: true, error: null }));

    try {
      const data = await postData(url, "post", {
        email: user.email,
        name: user.displayName,
        password: "",
        phone: user.phoneNumber,
        photoURL: user.photoURL,
        provider,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      handleTwoFA(data, dispatch, navigate);
    } catch (error) {
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

export const userLogout = (url, navigate) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().user;
      const { notifySocket } = getState().socket;
      if (user) {
        const data = await postData(url, "post", { userId: user._id });

        if (data.error) {
          throw new Error(data.error);
        }
      }

      dispatch(userActions.logout());
      dispatch(authActions.setAuth({ auth: false }));
      await signOut(authFirebase);

      navigate("/login");

      notifySocket.emit("notifyingUserIsOffline");

      dispatch(socketActions.disconnectSocket());
      dispatch(socketActions.setupSocket());
    } catch (error) {
      console.log(error);
    }
  };
};

const handleTwoFA = (data, dispatch, navigate) => {
  dispatch(userActions.setIsFetch({ isFetch: false }));
  if (data.twoFA.is2FAEnabled) {
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
            allowOutsideClick: false,
            backdrop: true,
            preConfirm: (otpToken) => {
              return postData(
                `${process.env.REACT_APP_ENDPOINT_SERVER}/verify-2fa`,
                "post",
                {
                  otpToken,
                  userId: data._id,
                  userSecret: data.twoFA.secret,
                }
              ).catch((error) => {
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
            },
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

            navigate("/video-chat/Chats");
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
    navigate("/video-chat/Chats");
  }
};

export const handleTwoFASettings = (setIsFetch, authRef) => {
  return async (dispatch, getState) => {
    const { user } = getState().user;

    setIsFetch(true);
    const data = await postData(
      `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/enable-2fa`,
      "post",
      {
        is2FAEnabled: authRef.current.classList.contains("active"),
        userId: user._id,
      }
    );

    if (data.update) {
      Swal.fire({
        icon: "success",
        title: data.update,
        showConfirmButton: false,
        timer: 5000,
      });
    } else if (data.QRCodeImage) {
      Swal.fire({
        html: `
              <strong>Enable two factor authentication!!</strong><br/><br/>
              <span>Using Google Authenticator App to access code!!!</span>
            `,
        width: 500,
        showConfirmButton: true,
        confirmButtonText: "Next",
        showCancelButton: true,
        allowOutsideClick: false,
        imageUrl: data.QRCodeImage,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            while (true) {
              const result = await Swal.fire({
                title: "Enter the 6-digit code you see in the app",
                input: "number",
                inputPlaceholder: "6-digits",
                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Submit",
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                backdrop: true,
                preConfirm: (otpToken) => {
                  return postData(
                    `${process.env.REACT_APP_ENDPOINT_SERVER}/verify-2fa`,
                    "post",
                    {
                      otpToken,
                      userId: data.user._id,
                    }
                  ).catch((error) => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                  });
                },
              });
              if (result.isDismissed) {
                authRef.current.classList.remove("active");
                const response = await postData(
                  `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/enable-2fa`,
                  "post",
                  {
                    is2FAEnabled: false,
                    userId: data.user._id,
                  }
                );
                dispatch(
                  userActions.setUser({
                    user: { ...response.user },
                  })
                );
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
                  userActions.setUser({
                    user: { ...data.user },
                  })
                );
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
        } else {
          authRef.current.classList.remove("active");

          const response = await postData(
            `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/enable-2fa`,
            "post",
            {
              is2FAEnabled: false,
              userId: data.user._id,
            }
          );

          dispatch(
            userActions.setUser({
              user: response.user,
            })
          );
        }
      });
    }
    return setIsFetch(false);
  };
};
