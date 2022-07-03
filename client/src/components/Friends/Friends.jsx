import React, { useRef } from "react";
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
import { formatDate } from "../../utilities/utilities";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postAddFriend } from "../../store/friends-creator";
import { beforeStartVideo } from "../../store/video-creator";
import { errorActions } from "../../store/error-slice";

const Friends = (props) => {
  const {
    avatar,
    name,
    _id,
    isLoggined,
    birth,
    phone,
    email,
    website,
    facebook,
    address,
    twitter,
    instagram,
    linkedin,
  } = props.friend;
  const user = useSelector((state) => state.user.user);
  const error = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const callHandle = () => {
    if (isLoggined) {
      return dispatch(
        beforeStartVideo(
          "Caller",
          props.friend,
          user,
          props.room,
          navigate,
          error
        )
      );
    }

    dispatch(
      errorActions.setError({
        error: true,
        message: "Can't call user because user is offline",
      })
    );
  };

  const messageHandle = async () => {
    dispatch(postAddFriend(_id, name, navigate));
  };

  return (
    <CardFriends>
      <Container>
        <Content>
          <Row>
            <Col>
              <Body>
                <Avatar>
                  <img src={`${avatar.url}`} alt="" />
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
                    <p>{birth}</p>
                  </div>
                  <AiOutlineCalendar />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Phone</p>
                    <p>{phone}</p>
                  </div>
                  <IoCallOutline />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Email</p>
                    <p>{email}</p>
                  </div>
                  <AiOutlineMail />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Website</p>
                    <p>{website}</p>
                  </div>
                  <HiOutlineGlobe />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Address</p>
                    <p>{address}</p>
                  </div>
                  <AiOutlineHome />
                </ListItem>
              </ListGroup>
              <ListGroup>
                <ListItem>
                  <div>
                    <p>Facebook</p>
                    <a href={facebook}>{facebook.split("/").splice(-1)[0]}</a>
                  </div>
                  <FiFacebook />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Twitter</p>
                    <a href={twitter}>{twitter.split("/").splice(-1)[0]}</a>
                  </div>
                  <FiTwitter />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Instagram</p>
                    <a href={instagram}>{instagram.split("/").splice(-1)[0]}</a>
                  </div>
                  <FiInstagram />
                </ListItem>
                <ListItem>
                  <div>
                    <p>Linkedin</p>
                    <a href={linkedin}>{linkedin.split("/").splice(-1)[0]}</a>
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
