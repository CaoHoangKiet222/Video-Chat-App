import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  searchToDisplay,
} from "../../utilities/utilities";
import SkeletonComponent from "../UI/Skeleton";
import Profile from "../Profile/Profile";
import { DropDown, DropDownContent } from "../ChatBar/Main/Main.styled";
import ModalGroup from "../ModalGroup/ModalGroup";
import ChatGroupItems from "./ChatGroupItems";
import ModalDialog from "../ModalDialog/ModalDialog";
import { forwardActions } from "../../store/forward-slice";
import ModalInvitation from "../ModalGroup/ModalInvitation";

const SideBars = (props) => {
  const conversation = useSelector((state) => state.conversation.conversation);
  const friends = useSelector((state) => state.friends.friends);
  const calls = useSelector((state) => state.calls.calls);
  const isDiff = useRef(false);
  const [searchName, setSearchName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModalGroup, setShowModalGroup] = useState(false);
  const [showModalInvitation, setShowModalInvitation] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const { forward } = useSelector((state) => state.forward);
  const dispatch = useDispatch();
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

  const inviteOthersHandler = () => {
    setShowModalInvitation(true);
  };

  const createNewChatHandler = () => {
    setShowModalDialog(true);
    dispatch(
      forwardActions.setForward({ forward: { isClick: false, message: null } })
    );
  };

  return (
    <SideBar>
      <ContactsContent>
        {showModalDialog && (
          <ModalDialog
            conversation={conversation?.conv}
            isForward={forward?.isClick}
            friends={friends}
            setShowModalDialog={setShowModalDialog}
          />
        )}
        {showModalGroup && (
          <ModalGroup setShowModalGroup={setShowModalGroup} friends={friends} />
        )}
        {showModalInvitation && (
          <ModalInvitation setShowModalInvitation={setShowModalInvitation} />
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
                        <div onClick={createNewChatHandler}>
                          <span>New Chat</span>
                        </div>
                        <div onClick={createGroupHandler}>
                          <span>Create Group</span>
                        </div>
                        <div onClick={inviteOthersHandler}>
                          <span>Invite Others</span>
                        </div>
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
                  .filter(({ groupName, members }) => {
                    if (groupName !== "") {
                      return searchToDisplay(groupName, searchName);
                    }

                    const { userId: member } = members.find(
                      (member) => member.userId._id !== conversation.user._id
                    );
                    return searchToDisplay(member.name, searchName);
                  })
                  .map(({ groupName, groupImg, members, messages, _id }) => {
                    const lastMessage = messages?.slice(-1)[0];

                    // Chat for multiple users
                    if (groupName !== "" && groupImg.url !== "") {
                      const sender = members?.find(
                        (member) => member?.userId._id === lastMessage?.senderId
                      );

                      return (
                        <ChatGroupItems
                          key={_id}
                          groupImg={groupImg.url}
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
                    return searchToDisplay(friend.name, searchName);
                  })
                  .map((friend, index) => {
                    if (
                      index === 0 ||
                      friends[index - 1].name[0].toLowerCase() !==
                        friend.name[0].toLowerCase()
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
