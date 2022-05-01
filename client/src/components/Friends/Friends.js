import React, { useEffect, useRef } from "react";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Body,
  CardFriends,
  Col,
  Container,
  Content,
  Icons,
  Item,
  ListGroup,
  ListItem,
  Options,
  Row,
  RowInfo,
} from "./Friends.styled";
import { IoCallOutline } from "react-icons/io5";
import {
  AiOutlineMessage,
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineHome,
} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineGlobe } from "react-icons/hi";
import { FiLinkedin, FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { formatDate, postData } from "../../utilities/utilities";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { conversationActions } from "../../store/conversations-slice";

const Friends = (props) => {
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const { avata, name } = props.friend;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const callHandle = () => {
    // dispatch(videoStart(myVideo));
    // navigate(`/video-chat/Friends/meeting/${encodeURIComponent(_id)}`);
  };

  // const buttonHandle = () => {
  //    dispatch(answerCall(socket, userVideo, connectionRef));
  // }

  const messageHandle = async () => {
    const data = await postData(`${ENDPOINT_SERVER}/add-friend`, "post", {
      friendId: props.friend._id,
    });
    dispatch(conversationActions.setConversation({ conversation: data }));
    navigate(`/video-chat/Chats/${encodeURIComponent(name)}`);
  };

  return (
    <CardFriends>
      <Container>
        <Content>
          <Row>
            <Col>
              <Body>
                <Avatar>
                  <img src={`${ENDPOINT_CLIENT}/${avata}`} alt="" />
                </Avatar>
                <Item>
                  <h5>{name}</h5>
                  <Icons>
                    <div onClick={messageHandle}>
                      <AiOutlineMessage />
                    </div>
                    <div onClick={callHandle}>
                      <IoCallOutline />
                    </div>
                  </Icons>
                </Item>
              </Body>
              <Options>
                <BsThreeDotsVertical />
              </Options>
            </Col>
          </Row>
          <RowInfo>
            <Col>
              <ListGroup>
                <ListItem>
                  <div>
                    <p>Local Time</p>
                    <p>{formatDate(Date.now())}</p>
                  </div>
                  <MdAccessTime />
                </ListItem>
                <ListItem>
                  <div>
                    <p>BirthDate</p>
                    <p>{}</p>
                  </div>
                  <AiOutlineCalendar />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Phone</p>
                    <p>0982402349</p>
                  </div>
                  <IoCallOutline />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Email</p>
                    <p>caotuankietc3a@gmail.com</p>
                  </div>
                  <AiOutlineMail />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Website</p>
                    <p>www.caotuankiet.com</p>
                  </div>
                  <HiOutlineGlobe />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Address</p>
                    <p>34/8/4 No Trang Long</p>
                  </div>
                  <AiOutlineHome />
                </ListItem>
              </ListGroup>
              <ListGroup>
                <ListItem>
                  <div>
                    <p>Facebook</p>
                    <a href="https://www.facebook.com/kiet.caohoang.35">
                      @kiet.caotuan
                    </a>
                  </div>
                  <FiFacebook />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Twitter</p>
                    <a href="">@kiet.caotuan</a>
                  </div>
                  <FiTwitter />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Instagram</p>
                    <a href="">@kiet.caotuan</a>
                  </div>
                  <FiInstagram />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Linkedin</p>
                    <a href="">@kiet.caotuan</a>
                  </div>
                  <FiLinkedin />
                </ListItem>
              </ListGroup>
            </Col>
          </RowInfo>
        </Content>
      </Container>
    </CardFriends>
  );
};

export default Friends;
