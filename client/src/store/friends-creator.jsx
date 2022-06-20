import { postData } from "../utilities/utilities";
import { conversationActions } from "./conversations-slice";
import { friendsActions } from "./friends-slice";

export const fetchFriends = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT_SERVER}/Friends/list-friends`,
        { credentials: "include" }
      );
      const data = await response.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(friendsActions.setFriends({ friends: data, error: null }));
    } catch (err) {
      dispatch(
        friendsActions.setFriends({ friends: null, error: err.message })
      );
    }
  };
};

export const postAddFriend = (
  id,
  name,
  navigate,
  setShowModalDialog,
  setIsFetch
) => {
  return async (dispatch) => {
    setIsFetch(true);
    dispatch(
      conversationActions.setConversation({
        conversation: await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/add-friend`,
          "post",
          {
            friendId: id,
          }
        ),
      })
    );
    navigate(`/video-chat/Chats/${encodeURIComponent(name)}`);
    setShowModalDialog(false);
    setIsFetch(false);
  };
};
