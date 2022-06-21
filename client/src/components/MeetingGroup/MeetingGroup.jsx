import React, { useEffect, useRef } from "react";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Buttons,
  Container,
  Content,
  ImgWrapper,
  Join,
  Picture,
  RoundedButton,
} from "../Friends/Meeting.styled";
import { FiPhoneOff, FiPhone, FiVideo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { findImgGroup, findNameGroup } from "../../utilities/utilities";

const MeetingGroup = () => {
  console.log("MeetingGroup running");
  const params = useParams();
  const { conversation } = useSelector((state) => state.conversation);
  const videoGroup = useSelector((state) => state.videoGroup);
  const groupImg = useRef(null);
  const groupName = useRef(null);
  const navigate = useNavigate();
  console.log(videoGroup);

  useEffect(() => {
    groupImg.current = findImgGroup(conversation?.conv, params.meetingId);
    groupName.current = findNameGroup(conversation?.conv, params.meetingId);
  }, [conversation?.conv, params.meetingId]);

  const closeVideo = () => {
    navigate("/video-chat/Chats");
  };

  const acceptPhone = () => {};

  const acceptVideo = () => {};

  return (
    <Container>
      <Content>
        <Join>
          <img src="/images/incoming-call.svg" alt="" />
          <p className="name">INCOMING CALL</p>
          <p className="title">{videoGroup.caller.name}</p>
          <p className="message"> in group {groupName.current} start video</p>
          <Picture>
            <ImgWrapper>
              <Avatar>
                <img src={groupImg.current} alt="" />
              </Avatar>
            </ImgWrapper>
          </Picture>
          <Buttons>
            <RoundedButton className="close" onClick={closeVideo}>
              <FiPhoneOff />
            </RoundedButton>
            <RoundedButton onClick={acceptVideo}>
              <FiVideo />
            </RoundedButton>
          </Buttons>
        </Join>
      </Content>
    </Container>
  );
};

export default MeetingGroup;
