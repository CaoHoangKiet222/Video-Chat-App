import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import InfoBar from "../ChatBar/InfoBar/InfoBar";
import { Container, DefaultUser, MainLayout } from "./Chat.styled";
import { useDispatch, useSelector } from "react-redux";
import SideBars from "./SideBars";
import NavBars from "./NavBars";
import Friends from "../Friends/Friends";
import { fetchConversation } from "../../store/conversations-creator";
import { fetchFriends } from "../../store/friends-creator";
import Meeting from "../Friends/Meeting";
import { v4 as uuidv4 } from "uuid";
import InfoBarLoading from "../ChatBar/InfoBar/InfoBarLoading";
import { fetchCalls } from "../../store/calls-creator";
import CallDetails from "../Calls/CallDetails";
import ModalDialog from "../ModalDialog/ModalDialog";
import { forwardActions } from "../../store/forward-slice";
import Notification from "../UI/Notification";
import { errorActions } from "../../store/error-slice";
import Settings from "../Profile/Settings";
import { beforeStartVideo } from "../../store/video-creator";
import { getConversationId } from "../../utilities/utilities";
import ChatGroup from "../ChatGoup/ChatGroup";
import MeetingGroup from "../MeetingGroup/MeetingGroup";
import { videoGroupActions } from "../../store/videoGroup-slice";
import Swal from "sweetalert2";

const Chat = () => {
  const { conversation } = useSelector((state) => state.conversation);
  const { friends } = useSelector((state) => state.friends);
  const { calls } = useSelector((state) => state.calls);
  const { user } = useSelector((state) => state.user);
  const { forward } = useSelector((state) => state.forward);
  const { error, message } = useSelector((state) => state.error);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();
  const [isChosen, setIsChosen] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const { notifySocket, meetingSocket, chatSocket } = useSelector(
    (state) => state.socket
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchConversation());
    dispatch(fetchFriends());
    dispatch(fetchCalls());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading && user) {
      notifySocket.emit("notifyingUserIsOnline", {
        userId: user._id,
      });
    }
  }, [notifySocket, user, isLoading]);

  useEffect(() => {
    if (forward?.isClick) {
      setShowModalDialog(true);
    }
  }, [forward]);

  useEffect(() => {
    if (user?.name || user?.avatar) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (params["*"].split("/").length === 1) {
      setIsChosen(false);
    } else {
      setIsChosen(true);
    }
  }, [params]);

  useEffect(() => {
    let timer = 0;
    if (error) {
      timer = setTimeout(() => {
        dispatch(errorActions.resetError({ error: false }));
      }, 6000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [error, dispatch]);

  useEffect(() => {
    // to be careful to put socket-client in map() because it can run multiple times
    notifySocket.on("notifyingUserIsOnline", () => {
      dispatch(fetchConversation());
      dispatch(fetchFriends());
    });

    notifySocket.on("notifyingUserIsOffline", () => {
      dispatch(fetchConversation());
      dispatch(fetchFriends());
    });

    notifySocket.on("notifyingUserAddFriend", () => {
      dispatch(fetchConversation());
    });

    notifySocket.on("notifyingUserAddGroup", () => {
      dispatch(fetchConversation());
    });

    notifySocket.on("notifyingDeleteUser", () => {
      dispatch(fetchConversation());
    });

    notifySocket.on("notifyingBlockUser", () => {
      dispatch(fetchConversation());
    });

    chatSocket.on("blockConversation", ({ userBlock, isBlock }) => {
      Swal.fire({
        title: isBlock
          ? "Conversation is unblocked!!!"
          : "Conversation is blocked!!!",
        html: isBlock
          ? `Your friend <strong>${userBlock.name}</strong> has unblocked this chat!!!`
          : `We are so sorry to notify that your friend <strong>${userBlock.name}</strong> has blocked this chat!!!`,
        icon: "warning",
        showConfirmButton: true,
        confirmButtonColor: "#665dfe",
        allowOutsideClick: false,
      });
    });

    chatSocket.on(
      "blockGroupConversation",
      ({ userBlock, isBlock, isAdmin }) => {
        if (isAdmin) {
          return Swal.fire({
            title: isBlock
              ? "Group chat is unblocked!!!"
              : "Group chat is blocked!!!",
            html: isBlock
              ? `Your admin <strong>${userBlock.name}</strong> has unblocked this chat!!!`
              : `We are so sorry to notify that your admin <strong>${userBlock.name}</strong> has blocked this chat!!!`,
            icon: "warning",
            showConfirmButton: true,
            confirmButtonColor: "#665dfe",
            allowOutsideClick: false,
          });
        }
      }
    );

    chatSocket.on("deleteConversation", ({ userDelete }) => {
      navigate("/video-chat/Chats");
      Swal.fire({
        title: "Conversation is deleted!!!",
        html: `We are so sorry to notify that your friend <strong>${userDelete.name}</strong> has deleted this chat!!!`,
        icon: "warning",
        showConfirmButton: true,
        confirmButtonColor: "#665dfe",
        allowOutsideClick: false,
      });
    });

    chatSocket.on("deleteGroupConversation", ({ userDelete, isAdmin }) => {
      if (isAdmin) {
        navigate("/video-chat/Chats");
        return Swal.fire({
          title: "Group chat deleted!!!",
          html: `We are so sorry to notify that your admin <strong>${userDelete.name}</strong> has deleted this chat!!!`,
          icon: "warning",
          showConfirmButton: true,
          confirmButtonColor: "#665dfe",
          allowOutsideClick: false,
        });
      }

      Swal.fire({
        title: "Someone leave group!!!",
        html: `We are so sorry to notify that your friend <strong>${userDelete.name}</strong> has leaved this chat!!!`,
        icon: "warning",
        showConfirmButton: true,
        confirmButtonColor: "#665dfe",
        allowOutsideClick: false,
      });
    });

    meetingSocket.on(
      "meetingConnection",
      ({ callId, caller, callee, isReceiving }) => {
        dispatch(
          beforeStartVideo(
            "Callee",
            callee,
            caller,
            callId,
            navigate,
            null,
            isReceiving
          )
        );
      }
    );

    return () => {
      notifySocket.removeAllListeners();
      meetingSocket.removeAllListeners();
      chatSocket.removeAllListeners();
    };
  }, [notifySocket, dispatch, navigate, meetingSocket, chatSocket]);

  useEffect(() => {
    meetingSocket.on("meetingGroupConnection", ({ room, caller, members }) => {
      const {
        block: { isBlock },
      } = members.find((member) => {
        return member.userId._id === user._id;
      });

      if (!isBlock) {
        navigate(`/video-chat/Chats/meeting-group/${encodeURIComponent(room)}`);
        dispatch(videoGroupActions.setCaller({ caller }));
      }
    });

    return () => meetingSocket.off("meetingGroupConnection");
  }, [dispatch, meetingSocket, navigate, user]);

  useEffect(() => {
    chatSocket.on(
      "blockGroupSingleConversation",
      ({ userBlock, isBlock, isAdmin, userIsBlockedId }) => {
        if (isAdmin && userIsBlockedId === user?._id) {
          return Swal.fire({
            title: isBlock
              ? "Group chat is unblocked!!!"
              : "Group chat is blocked!!!",
            html: isBlock
              ? `Your admin <strong>${userBlock.name}</strong> has unblocked this chat!!!`
              : `We are so sorry to notify that your admin <strong>${userBlock.name}</strong> has blocked this chat!!!`,
            icon: "warning",
            showConfirmButton: true,
            confirmButtonColor: "#665dfe",
            allowOutsideClick: false,
          });
        }
      }
    );
    return () => {
      chatSocket.off("blockGroupSingleConversation");
    };
  }, [chatSocket, user]);

  const startConversation = () => {
    setShowModalDialog(true);
    dispatch(
      forwardActions.setForward({ forward: { isClick: false, message: null } })
    );
  };

  return (
    <Container>
      <MainLayout>
        <Notification text={message} active={error ? true : false} />
        {showModalDialog && (
          <ModalDialog
            conversation={conversation?.conv}
            isForward={forward?.isClick}
            friends={friends}
            setShowModalDialog={setShowModalDialog}
          />
        )}
        <NavBars />
        <Routes>
          <Route
            path="/Chats/*"
            element={<SideBars header="Chats" isLoading={isLoading} />}
          />
          <Route
            path="/Friends/*"
            element={
              <SideBars header="Friends" display="none" isLoading={isLoading} />
            }
          />
          <Route
            path="/Calls/*"
            element={<SideBars header="Calls" isLoading={isLoading} />}
          />
          <Route
            path="/Profile/*"
            element={<SideBars header="Profile" isLoading={isLoading} />}
          />
        </Routes>
        <Routes>
          {conversation?.conv?.map(
            ({ groupName, groupImg, members, messages, _id: id }) => {
              if (groupName !== "" && groupImg.url !== "") {
                return (
                  <Route
                    path={`Chats/group/${encodeURIComponent(groupName)}`}
                    key={uuidv4()}
                    element={
                      <ChatGroup
                        groupName={groupName}
                        groupImg={groupImg.url}
                        members={members}
                        messages={messages}
                        user={conversation.user}
                        room={id}
                      />
                    }
                  />
                );
              }
              const { userId: member, block } = members.find((member) => {
                return member.userId._id !== conversation.user._id;
              });

              return (
                <Route
                  path={`/Chats/${encodeURIComponent(member.name)}`}
                  key={uuidv4()}
                  element={
                    <InfoBar
                      room={id}
                      user={conversation.user}
                      member={member}
                      block={block}
                      messages={messages}
                      groupName={groupName}
                      groupImg={groupImg}
                    />
                  }
                />
              );
            }
          )}

          {friends?.map((friend) => {
            return (
              <Route
                path={`/Friends/list-friends/${encodeURIComponent(
                  friend.name
                )}`}
                key={friend._id}
                element={
                  <Friends
                    friend={friend}
                    room={getConversationId(conversation?.conv, friend, user)}
                  />
                }
              />
            );
          })}

          {calls?.map(({ contactMem, calls }) => {
            return (
              <Route
                path={`/Calls/details/${encodeURIComponent(contactMem.name)}`}
                key={contactMem._id}
                element={<CallDetails contactMem={contactMem} calls={calls} />}
              />
            );
          })}

          <Route path={`Chats/meeting/:meetingId`} element={<Meeting />} />
          <Route
            path={`Chats/meeting-group/:meetingId`}
            element={<MeetingGroup />}
          />
        </Routes>
        {params["*"] !== "Profile" ? (
          !isChosen && (
            <DefaultUser>
              <div className="user">
                <div className="container">
                  {isLoading ? (
                    <InfoBarLoading background="#323333" />
                  ) : (
                    <>
                      <div className="avatar">
                        <img src={`${user?.avatar.url}`} alt="" />
                      </div>
                      <h5>Welcome, {user?.name}!</h5>
                      <p>Please select a chat to start messaging.</p>
                      <button onClick={startConversation}>
                        Start a conversation
                      </button>
                    </>
                  )}
                </div>
              </div>
            </DefaultUser>
          )
        ) : (
          <Settings />
        )}
      </MainLayout>
    </Container>
  );
};

export default Chat;
