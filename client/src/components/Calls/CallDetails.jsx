import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { arrangePhoneTime } from "../../utilities/utilities";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Body,
  Col,
  Icons,
  Item,
  ListGroup,
  Options,
  Row,
} from "../Friends/Friends.styled";
import { CallLogs, Calls, Container, Main } from "./CallDetails.styled";
import CallItem from "./CallItem";

const CallDetails = (props) => {
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  const { avata, name, phone } = props.contactMem;
  console.log(arrangePhoneTime(props.calls));

  return (
    <Main>
      <Calls>
        <Container>
          <Row>
            <Col>
              <Body>
                <Avatar>
                  <img src={`${ENDPOINT_CLIENT}/${avata}`} alt="" />
                </Avatar>
                <Item>
                  <h5>{name}</h5>
                  <Icons>
                    <p>{phone === "Unknown" ? phone + " Phone" : phone}</p>
                  </Icons>
                </Item>
              </Body>
              <Options>
                <BsThreeDotsVertical />
              </Options>
            </Col>
          </Row>
          <CallLogs>
            <Col>
              <ListGroup>
                {arrangePhoneTime(props.calls).map((call) => {
                  return <CallItem call={call} key={call._id} />;
                })}
              </ListGroup>
            </Col>
          </CallLogs>
        </Container>
      </Calls>
    </Main>
  );
};

export default CallDetails;
