import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { authFirebase } from "../utilities/firebase";
import { postData } from "../utilities/utilities";
import { authActions } from "./auth-slice";
import { errorActions } from "./error-slice";
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
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            html: data.error,
            showConfirmButton: false,
            timer: 5000,
          });
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
        handleTwoFA(data, dispatch, getState);
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

export const fetchLoginByFirebase = (url, user, provider) => {
  return async (dispatch, getState) => {
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

      console.log(data);

      handleTwoFA(data, dispatch, getState);
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
export const userLogout = (url, userId, navigate) => {
  return async (dispatch, getState) => {
    try {
      const response = await postData(url, "post", { userId });
      const { notifySocket } = getState().socket;
      console.log(response);

      if (!response.error) {
        dispatch(userActions.logout());
        dispatch(authActions.setAuth({ auth: false }));
        await signOut(authFirebase);

        navigate("/login");

        notifySocket.emit("notifyingUserIsOffline");

        dispatch(socketActions.disconnectSocket());
      }
    } catch (error) {
      dispatch(errorActions.setError({ error: true, message: error.message }));
    }
  };
};

const handleTwoFA = (data, dispatch, getState) => {
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
};
