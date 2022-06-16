import { postData } from "../utilities/utilities";
import { errorActions } from "./error-slice";
import { userActions } from "./user-slice";
let timer;

export const fetchLogin = (url, user) => {
  return async (dispatch) => {
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

      timer = setTimeout(() => {
        dispatch(
          userActions.login({
            user: {
              email: data.email,
              password: data.password,
              confirmPassword: data.confirmPassword,
            },
            isFetch: false,
            error: null,
          })
        );
      }, 1500);
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
      }, 1500);
    }
  };
};

export const fetchSession = (url, navigate) => {
  return async (dispatch) => {
    try {
      const response = await fetch(url, { credentials: "include" });
      const { isRemember } = await response.json();
      if (isRemember) {
        setTimeout(() => {
          navigate("/video-chat/Chats");
        }, 1000);
        dispatch(userActions.setIsFetch({ isFetch: true }));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const userLogout = (url, userId, navigate) => {
  return async (dispatch) => {
    try {
      const response = await postData(url, "post", { userId });
      console.log(response);

      if (!response.error) {
        navigate("/login");
        dispatch(userActions.logout());
      }
    } catch (error) {
      dispatch(errorActions.setError({ error: true, message: error.message }));
    }
  };
};
