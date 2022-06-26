import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ChatsHeader,
  ChatsList,
  ChatsSubHeader,
  ContactsContent,
  HeaderContent,
  SideBar,
} from "./SideBars.styled";
import ChatItems from "./ChatItems";
import { BsBell, BsSearch } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
  arrangePhoneTime,
  closeComponent,
  getPhoneTime,
  searchUser,
} from "../../utilities/utilities";
import SkeletonComponent from "../UI/Skeleton";
import Profile from "../Profile/Profile";
import { DropDown, DropDownContent } from "../ChatBar/Main/Main.styled";
import ModalGroup from "../ModalGroup/ModalGroup";
import ChatGroupItems from "./ChatGroupItems";

const SideBars = (props) => {
  console.log("SideBars running");
  const conversation = useSelector((state) => state.conversation.conversation);
  const friends = useSelector((state) => state.friends.friends);
  const calls = useSelector((state) => state.calls.calls);
  const isDiff = useRef(false);
  const [searchName, setSearchName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModalGroup, setShowModalGroup] = useState(false);
  const chatsList = useRef(null);

  const removeAllBackground = useCallback(() => {
    chatsList.current.querySelectorAll("li > a").forEach((chatItems) => {
      chatItems.style.background = "none";
    });
  }, []);

  useEffect(() => {
    if (props.header !== "Profile") {
      if (conversation || friends || calls || searchName || props.header) {
        chatsList.current.querySelectorAll("li > a").forEach((chatItems) => {
          chatItems.addEventListener("click", () => {
            removeAllBackground();
            chatItems.style.background = "#665dfe";
          });
        });
      }
    }
  }, [
    conversation,
    friends,
    calls,
    searchName,
    props.header,
    removeAllBackground,
  ]);

  useEffect(() => {
    return closeComponent(showDropdown, setShowDropdown);
  }, [showDropdown]);

  const startSearch = (e) => {
    setSearchName(e.target.value);
  };

  const dropDownHandler = () => {
    setShowDropdown(true);
  };

  const createGroupHandler = () => {
    setShowModalGroup(true);
  };

  return (
    <SideBar>
      <ContactsContent>
        {showModalGroup && (
          <ModalGroup setShowModalGroup={setShowModalGroup} friends={friends} />
        )}
        <ChatsHeader>
          <HeaderContent>
            <h5>{props.header}</h5>
            {props.header !== "Profile" && (
              <ul>
                <li>
                  <DropDown>
                    <BsBell />
                  </DropDown>
                </li>
                <li>
                  <DropDown onClick={dropDownHandler}>
                    <BiDotsVerticalRounded />
                    {showDropdown && (
                      <DropDownContent translate="translate(-140px, 15px)">
                        <a href="#">
                          <span>New Chat</span>
                        </a>
                        <a href="#" onClick={createGroupHandler}>
                          <span>Create Group</span>
                        </a>
                        <a href="#">
                          <span>Invite Others</span>
                        </a>
                      </DropDownContent>
                    )}
                  </DropDown>
                </li>
              </ul>
            )}
          </HeaderContent>
          {props.header !== "Profile" ? (
            <ChatsSubHeader display={props.display}>
              <div>
                <button type="button">All Chats</button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={startSearch}
                ></input>
                <div>
                  <div>
                    <BsSearch />
                  </div>
                </div>
              </div>
            </ChatsSubHeader>
          ) : (
            <h5>Personal Information & Settings</h5>
          )}
        </ChatsHeader>
        {props.header !== "Profile" ? (
          <ChatsList ref={chatsList}>
            {
              // Chats
              props.isLoading ? (
                <SkeletonComponent />
              ) : (
                props.header === "Chats" &&
                conversation?.conv
                  .filter(({ members }) => {
                    const { userId: member } = members.find(
                      (member) => member.userId._id !== conversation.user._id
                    );
                    return searchUser(member, searchName);
                  })
                  .map(({ groupName, groupImg, members, messages, _id }) => {
                    const lastMessage = messages?.slice(-1)[0];

                    // Chat for multiple users
                    if (groupName !== "" && groupImg !== "") {
                      const sender = members?.find(
                        (member) => member?.userId._id === lastMessage?.senderId
                      );

                      return (
                        <ChatGroupItems
                          key={_id}
                          groupImg={groupImg}
                          groupName={groupName}
                          senderName={sender?.userId.name}
                          content={lastMessage?.content}
                          messageDate={lastMessage?.messageDate}
                          imagesLength={lastMessage?.files?.images?.length}
                          room={_id}
                        />
                      );
                    }

                    // Chat for only user and another person
                    const { userId: member } = members.find(
                      (member) => member.userId._id !== conversation.user._id
                    );

                    return (
                      <ChatItems
                        key={_id}
                        member={member}
                        header={props.header}
                        messageDate={lastMessage?.messageDate}
                        content={lastMessage?.content}
                        room={_id}
                      />
                    );
                  })
              )
            }
            {
              // Phone Calls
              props.isLoading ? (
                <SkeletonComponent />
              ) : (
                props.header === "Calls" &&
                calls?.map(({ contactMem, calls }) => {
                  const sortCalls = arrangePhoneTime(calls);
                  const firstCall = getPhoneTime(sortCalls[0]);

                  return (
                    <ChatItems
                      key={contactMem._id}
                      member={contactMem}
                      header={props.header}
                      firstStartCall={firstCall.startCall}
                      call={sortCalls.slice(-1)[0]}
                    />
                  );
                })
              )
            }
            {
              // Friends
              props.isLoading ? (
                <SkeletonComponent />
              ) : (
                props.header === "Friends" &&
                friends
                  ?.filter((friend) => {
                    return searchUser(friend, searchName);
                  })
                  .map((friend, index) => {
                    if (
                      index === 0 ||
                      friends[index - 1].name[0] !== friend.name[0]
                    ) {
                      isDiff.current = true;
                    } else isDiff.current = false;

                    return (
                      <ChatItems
                        key={friend._id}
                        member={friend}
                        header={props.header}
                        address={friend.address}
                        isDiff={isDiff.current}
                      />
                    );
                  })
              )
            }
          </ChatsList>
        ) : (
          // Profile
          <Profile />
        )}
      </ContactsContent>
    </SideBar>
  );
};

export default SideBars;
