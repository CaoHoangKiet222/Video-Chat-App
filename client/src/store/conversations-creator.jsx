import { conversationActions } from "./conversations-slice";
import { userActions } from "./user-slice";

export const fetchConversation = () => {
  return async (dispatch) => {
    try {
      const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

      const response = await fetch(`${ENDPOINT_SERVER}/Chats/conversation`, {
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(
        conversationActions.setConversation({ conversation: data, error: null })
      );

      dispatch(userActions.login({ user: data.user }));
    } catch (err) {
      console.log(err);
      dispatch(
        conversationActions.setConversation({
          conversation: null,
          error: err.message,
        })
      );
    }
  };
};

export const addFriend = () => {};
