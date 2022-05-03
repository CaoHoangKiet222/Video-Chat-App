import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import InfoBar from "../ChatBar/InfoBar/InfoBar";
import { Container, MainLayout } from "./Chat.styled";
import { useDispatch, useSelector } from "react-redux";
import SideBars from "./SideBars";
import NavBars from "./NavBars";
import Friends from "../Friends/Friends";
import { fetchConversation } from "../../store/conversations-creator";
import { fetchFriends } from "../../store/friends-creator";
import Meeting from "../Friends/Meeting";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const { conversation } = useSelector((state) => state.conversation);
  const { friends } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConversation());
    dispatch(fetchFriends());
  }, [dispatch]);

  return (
    <Container>
      <MainLayout>
        <NavBars />
        <Routes>
          <Route path="/Chats/*" element={<SideBars header="Chats" />} />
          <Route
            path="/Friends/*"
            element={<SideBars header="Friends" display="none" />}
          />
          <Route path="/Calls/*" element={<SideBars header="Calls" />} />
          <Route path="/Account/*" element={<SideBars header="Account" />} />
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
          <Route path={`Chats/meeting/:meetingId`} element={<Meeting />} />
        </Routes>
      </MainLayout>
    </Container>
  );
};

export default Chat;
