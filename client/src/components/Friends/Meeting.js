import React from "react";
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
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Meeting = () => {
  console.log("Meeting running");
  const params = useParams();
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { isReceiving, callee, caller } = useSelector(
    (state) => state.video.call
  );
  const { meetingSocket } = useSelector((state) => state.socket);

  const closePhone = () => {
    meetingSocket.emit("notAnswerCall", params.meetingId);
  };

  const acceptPhone = () => {
    console.log("acceptPhone");
  };

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
          <p className="title">{isReceiving ? callee.name : caller.name}</p>
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
            <RoundedButton className="close" onClick={closePhone}>
              <FiPhoneOff />
            </RoundedButton>
            {isReceiving && (
              <>
                <RoundedButton className="accept" onClick={acceptPhone}>
                  <FiPhone />
                </RoundedButton>
                <RoundedButton>
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

export default Meeting;
