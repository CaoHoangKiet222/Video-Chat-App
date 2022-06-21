import React, { useEffect } from "react";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Buttons,
  Container,
  Content,
  ImgWrapper,
  Join,
  Picture,
  RoundedButton,
} from "./Meeting.styled";
import { FiPhoneOff, FiPhone, FiVideo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const MeetingGroup = () => {
  console.log("MeetingGroup running");
  const params = useParams();
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { meetingSocket } = useSelector((state) => state.socket);

  const closeVideo = () => {};

  const acceptPhone = () => {};

  const acceptVideo = () => {};

  return (
    <Container>
      <Content>
        <Join>
          <img
            src={`/images/${
              !isReceiving ? "outgoing-call.svg" : "incoming-call.svg"
            }`}
            alt=""
          />
          <p className="name">
            {!isReceiving ? "OUTGOING CALL" : "INCOMING CALL"}
          </p>
          <p className="title">{isReceiving ? caller.name : callee.name}</p>
          <Picture>
            <ImgWrapper>
              <Avatar>
                <img
                  src={`${ENDPOINT_CLIENT}/${
                    isReceiving ? callee.avata : caller.avata
                  }`}
                  alt=""
                />
              </Avatar>
            </ImgWrapper>
          </Picture>
          <Buttons>
            <RoundedButton className="close" onClick={closeVideo}>
              <FiPhoneOff />
            </RoundedButton>
            {isReceiving && (
              <>
                <RoundedButton className="accept" onClick={acceptPhone}>
                  <FiPhone />
                </RoundedButton>
                <RoundedButton onClick={acceptVideo}>
                  <FiVideo />
                </RoundedButton>
              </>
            )}
          </Buttons>
        </Join>
      </Content>
    </Container>
  );
};

export default MeetingGroup;
