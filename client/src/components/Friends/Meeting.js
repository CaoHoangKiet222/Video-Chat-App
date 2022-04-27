import React, {useEffect, useState} from "react"
import {Avatar} from "../Chat/ChatItems.styled";
import {Buttons, Container, Content, ImgWrapper, Join, Picture, RoundedButton} from "./Meeting.styled";
import {FiPhoneOff, FiPhone, FiVideo} from 'react-icons/fi';
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {postData} from "../../utilities/utilities";

const Meeting = () => {
   const params = useParams();
   const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
   const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
   const {call} = useSelector(state => state.video);
   const [callee, setCallee] = useState({});

   useEffect(() => {
      if (params.meetingId) {
         const fetchCallee = async () => {
            const data = await postData(`${ENDPOINT_SERVER}/meeting/${params.meetingId}`, "post");
            setCallee(data.friend);
         }
         fetchCallee();
      }
   }, [params.meetingId])

   return (
      <Container>
         <Content>
            <Join>
               <img src={`/images/${call?.callerName !== callee?.name ? "outgoing-call.svg" : "incoming-call.svg"}`} alt="" />
               <p className="name">{call?.callerName !== callee?.name ? "OUTGOING CALL" : "INCOMING CALL"}</p>
               <p className="title">{callee?.name}</p>
               <Picture>
                  <ImgWrapper>
                     <Avatar>
                        <img src={`${ENDPOINT_CLIENT}/${callee?.avata}`} alt="" />
                     </Avatar>
                  </ImgWrapper>
               </Picture>
               <Buttons>
                  <RoundedButton className="close"><FiPhoneOff /></RoundedButton>
                  {
                     call?.callerName === callee?.name &&
                     (<>
                        <RoundedButton className="accept"><FiPhone /></RoundedButton>
                        <RoundedButton><FiVideo /></RoundedButton>
                     </>)
                  }
               </Buttons>
            </Join>
         </Content>
      </Container>
   )
}

export default Meeting;
