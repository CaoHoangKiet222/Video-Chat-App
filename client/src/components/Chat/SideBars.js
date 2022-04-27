import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {ChatsHeader, ChatsList, ChatsSubHeader, ContactsContent, HeaderContent, SideBar} from './SideBars.styled';
import ChatItems from "./ChatItems";
import {BsBell, BsSearch} from 'react-icons/bs';
import {BiDotsVerticalRounded} from "react-icons/bi";

const SideBars = (props) => {
   const {conversation} = useSelector(state => state.conversation);
   const {friends} = useSelector(state => state.friends);
   const isDiff = useRef(false);

   return (
      <SideBar>
         <ContactsContent>
            <ChatsHeader>
               <HeaderContent>
                  <h5>{props.header}</h5>
                  <ul>
                     <li>
                        <a href="#"><BsBell /></a>
                     </li>
                     <li>
                        <a href="#"><BiDotsVerticalRounded /></a>
                     </li>
                  </ul>
               </HeaderContent>
               <ChatsSubHeader display={props.display}>
                  <div>
                     <button type="button">All Chats</button>
                  </div>
                  <div>
                     <input type="text" placeholder="Search users..."></input>
                     <div>
                        <div><BsSearch /></div>
                     </div>
                  </div>
               </ChatsSubHeader>
            </ChatsHeader>
            <ChatsList>
               {
                  // Chats
                  props.header === "Chats" && conversation?.conv.map(({members, messages, _id}) => {
                     const {userId: member} = members.find(member => member.userId._id !== conversation.user._id);
                     const lastMessage = messages?.slice(-1)[0];
                     return <ChatItems key={_id}
                        member={member}
                        messages={messages}
                        user={conversation.user}
                        header={props.header}
                        messageDate={lastMessage?.messageDate}
                        content={lastMessage?.content}
                        room={_id}
                     />;
                  })
               }
               {
                  // Friends
                  props.header === "Friends" && friends?.map((friend, index) => {
                     if (index === 0 || friends[index - 1].name[0] !== friend.name[0]) {
                        isDiff.current = true;
                     }
                     else isDiff.current = false;

                     return <ChatItems
                        key={friend._id}
                        member={friend}
                        header={props.header}
                        address={friend.address}
                        isDiff={isDiff.current}
                     />
                  })
               }
            </ChatsList>
         </ContactsContent>
      </SideBar>
   );
}

export default SideBars;
