import {useEffect, useState} from 'react';
import {Content, Divider, DropDown, DropDownContent, Message, MessageOptions, MessageWrap} from "./Main.styled";
import {Avatar} from "../../Chat/ChatItems.styled";
import {BiDotsHorizontalRounded} from "react-icons/bi";
import {formatDate} from "../../../utilities/utilities";
import {IoCopyOutline, IoReturnUpForward, IoReturnUpBack} from 'react-icons/io5';
import {AiOutlineStar} from 'react-icons/ai';
import {RiDeleteBinLine} from 'react-icons/ri';

const Messages = (props) => {
   const [showMenu, setShowMenu] = useState(false);
   useEffect(() => {
      const checkClickOutSide = () => {
         if (showMenu) {
            setShowMenu(false);
         }
      }
      document.addEventListener("click", checkClickOutSide);
      return () => {
         document.removeEventListener("click", checkClickOutSide);
      }
   }, [showMenu])

   const dropDownHandle = () => {
      setShowMenu(true);
   }

   return (
      <Message isRight={props.isRight}>
         <Divider data-label="helo"></Divider>
         <MessageWrap>
            <Content>
               <span>{props.message}</span>
            </Content>
         </MessageWrap>
         <MessageOptions>
            <Avatar>
               <img src="/images/user.jpg" alt="" />
            </Avatar>
            <span>{formatDate(props.time)}</span>
            <span>Edited</span>
            <DropDown onClick={dropDownHandle} >
               <BiDotsHorizontalRounded />
               {
                  showMenu && <DropDownContent>
                     <a href="#">
                        <IoCopyOutline></IoCopyOutline>
                        <span>Copy</span>
                     </a>
                     <a href="#">
                        <IoReturnUpBack></IoReturnUpBack>
                        <span>Reply</span>
                     </a>
                     <a href="#">
                        <IoReturnUpForward></IoReturnUpForward>
                        <span>Forward</span>
                     </a>
                     <a href="#">
                        <AiOutlineStar></AiOutlineStar>
                        <span>Favourite</span>
                     </a>
                     <a href="#" className="text-danger">
                        <RiDeleteBinLine></RiDeleteBinLine>
                        <span>Delete</span>
                     </a>
                  </DropDownContent>
               }

            </DropDown>
         </MessageOptions>
      </Message>
   );
}

export default Messages;
