import { postData } from "../utilities/utilities";
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
        rememberToLogin: user.rememberToLogin,
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
              isRemember: user.isRemember,
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
