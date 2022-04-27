import React, {useEffect, useRef} from "react";
import {BiDotsVerticalRounded} from "react-icons/bi";
import {BsSearch, BsTelephone} from "react-icons/bs";
import {Link, useNavigate} from "react-router-dom";
import {Avatar} from "../../Chat/ChatItems.styled";
import {HeaderBar, Media, MediaContent, MediaInfo, MediaNav} from "./ChatHeader.styled";
import {useDispatch, useSelector} from "react-redux";
import {videoActions} from "../../../store/video-slice";
import {videoStart} from "../../../store/video-creator";

const ChatHeader = (props) => {
   const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
   const {member} = props;
   const dispatch = useDispatch();
   const myVideo = useRef();

   const callHandle = () => {
      dispatch(videoStart(myVideo));
      dispatch(videoActions.setCallId({callId: props.room}));
   }

   return <HeaderBar>
      <Media>
         <Avatar>
            <img src={`${ENDPOINT_CLIENT}/${member.avata}`} alt="" />
         </Avatar>
         <MediaContent>
            <MediaInfo>
               <h6>{member.name}</h6>
            </MediaInfo>
            <small>Online</small>
         </MediaContent>
      </Media>
      <MediaNav>
         <li>
            <Link to="">
               <BsSearch />
            </Link>
         </li>
         <li>
            <Link to="" onClick={callHandle}>
               <BsTelephone />
            </Link>
         </li>
         <li>
            <Link to="" onClick={(e) => {e.target.style.color = "#d5d5e5"}}>
               <BiDotsVerticalRounded />
            </Link>
         </li>
      </MediaNav>
   </HeaderBar>;

}

export default ChatHeader;
