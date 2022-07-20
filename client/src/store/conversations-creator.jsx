import Swal from "sweetalert2";
import { postData } from "../utilities/utilities";
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

export const blockConversation = (room, { isAdmin, isBlock }, type) => {
  return (dispatch, getState) => {
    try {
      const { user } = getState().user;
      const { chatSocket, notifySocket } = getState().socket;

      Swal.fire({
        title: isBlock
          ? "Unblock this conversation?"
          : "Block this conversation?",
        text: isBlock
          ? "Unblock for your friend can chat with you!"
          : "Once you block the conversation, your friend can't chat anything!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#665dfe",
        cancelButtonColor: "#d33",
        confirmButtonText: isBlock ? "Yes, unblock it!" : "Yes, block it!",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: () => {
          return postData(
            `${process.env.REACT_APP_ENDPOINT_SERVER}/${
              type === "single"
                ? "block-conversation"
                : // type === "group"
                  "block-group-conversation"
            }`,
            "post",
            type === "single"
              ? {
                  conversationId: room,
                  userId: user._id,
                  isBlock,
                }
              : {
                  // type === "group"
                  conversationId: room,
                  userId: user._id,
                  isBlock,
                  isAdmin,
                }
          ).catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
        },
      }).then(({ isDismissed, value }) => {
        if (isDismissed) {
          return;
        }

        if (value.error) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            html: value.error,
            showConfirmButton: false,
            timer: 5000,
          });
        }
        Swal.fire(
          isBlock ? "Unblock!" : "Block!",
          isBlock
            ? "This conversation has been unblocked."
            : "This conversation has been blocked.",
          "success"
        ).then(() => {
          dispatch(
            conversationActions.setConversation({
              conversation: value,
              error: null,
            })
          );

          chatSocket.emit(
            type === "single" ? "blockConversation" : "blockGroupConversation",
            { room, userBlock: value.user, isBlock, isAdmin }
          );
          notifySocket.emit("notifyingBlockUser");
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteConversation = (room, isAdmin = false, navigate, type) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().user;
      const { chatSocket, notifySocket } = getState().socket;

      Swal.fire({
        title: "Delete this entire conversation?",
        text: "Once you delete the conversation, it can't be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#665dfe",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: () => {
          return postData(
            `${process.env.REACT_APP_ENDPOINT_SERVER}/${
              type === "single"
                ? "delete-conversation"
                : // type === "group"
                  "delete-group-conversation"
            }`,
            "delete",
            type === "single"
              ? {
                  conversationId: room,
                }
              : {
                  // type === "group"
                  conversationId: room,
                  userId: user._id,
                  isAdmin,
                }
          ).catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
        },
      }).then(({ isDismissed, value }) => {
        if (isDismissed) {
          return;
        }
        if (value.error) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            html: value.error,
            showConfirmButton: false,
            timer: 5000,
          });
        }

        Swal.fire(
          "Deleted!",
          "Your conversation has been deleted.",
          "success"
        ).then(() => {
          dispatch(
            conversationActions.setConversation({
              conversation: value,
              error: null,
            })
          );
          chatSocket.emit(
            type === "single"
              ? "deleteConversation"
              : "deleteGroupConversation",
            { room, userDelete: value.user, isAdmin },
            () => {
              navigate("/video-chat/Chats");
            }
          );
          notifySocket.emit("notifyingDeleteUser");
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
};
