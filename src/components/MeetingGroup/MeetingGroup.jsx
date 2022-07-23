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
import { FiPhoneOff, FiVideo } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { findImgAndNameGroup } from "../../utilities/utilities";
import { useAudio } from "../Hook/useAudio";

const MeetingGroup = () => {
  const params = useParams();
  const { conversation } = useSelector((state) => state.conversation);
  const videoGroup = useSelector((state) => state.videoGroup);
  const group = useRef(null);
  const navigate = useNavigate();
  const [, setPlaying] = useAudio(
    `${process.env.REACT_APP_ENDPOINT_CLIENT}/audio/waiting-ringtone.wav`
  );

  useEffect(() => {
    setPlaying(true);
  }, [setPlaying]);

  useEffect(() => {
    group.current = findImgAndNameGroup(conversation?.conv, params.meetingId);
  }, [conversation?.conv, params.meetingId]);

  const closeVideo = async () => {
    await Promise.resolve(setPlaying(false));
    navigate("/video-chat/Chats");
  };

  const acceptVideo = async () => {
    await Promise.resolve(setPlaying(false));
    navigate(`/meeting-group/${params.meetingId}`);
  };

  return (
    <Container>
      <Content>
        <Join>
          <img src="/images/incoming-call.svg" alt="" />
          <p className="name">INCOMING CALL</p>
          <p className="title">{videoGroup.caller?.name}</p>
          <p className="message">
            {" "}
            in group <strong>"{group.current?.groupName}"</strong> starts video
          </p>
          <Picture>
            <ImgWrapper>
              <Avatar>
                <img src={group.current?.groupImg.url} alt="" />
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
