import React, { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
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

const Chat = () => {
  const { conversation } = useSelector((state) => state.conversation);
  const { friends } = useSelector((state) => state.friends);
  const { calls } = useSelector((state) => state.calls);
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();
  const [isChosen, setIsChosen] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const CLIENT_ENDPOINT = process.env.REACT_APP_ENDPOINT_CLIENT;

  useEffect(() => {
    dispatch(fetchConversation());
    dispatch(fetchFriends());
    dispatch(fetchCalls());
  }, [dispatch]);

  useEffect(() => {
    if (user?.name || user?.avata) {
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

  const startConversation = () => {
    setShowModalDialog(true);
  };

  return (
    <Container>
      <MainLayout>
        {showModalDialog && (
          <ModalDialog
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
            path="/Account/*"
            element={<SideBars header="Account" isLoading={isLoading} />}
          />
        </Routes>
        <Routes>
          {conversation?.conv.map(({ members, messages, _id: id }) => {
            const { userId: member } = members.find((member) => {
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
                    messages={messages}
                  />
                }
              />
            );
          })}

          {friends?.map((friend) => {
            return (
              <Route
                path={`/Friends/list-friends/${encodeURIComponent(
                  friend.name
                )}`}
                key={friend._id}
                element={<Friends friend={friend} />}
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
        </Routes>
        {!isChosen && (
          <DefaultUser>
            <div className="user">
              <div className="container">
                {isLoading ? (
                  <InfoBarLoading background="#323333" />
                ) : (
                  <>
                    <div className="avatar">
                      <img src={`${CLIENT_ENDPOINT}/${user.avata}`} alt="" />
                    </div>
                    <h5>Welcome, {user.name}!</h5>
                    <p>Please select a chat to start messaging.</p>
                    <button onClick={startConversation}>
                      Start a conversation
                    </button>
                  </>
                )}
              </div>
            </div>
          </DefaultUser>
        )}
      </MainLayout>
    </Container>
  );
};

export default Chat;
