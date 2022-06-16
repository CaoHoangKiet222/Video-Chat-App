import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import styled from "styled-components";

const Notification = (props) => {
  return (
    <Container className={`${props.active ? "active" : ""}`}>
      <Content>
        <Warning>
          <Wrapper>
            <div className="count-down"></div>
            <AiFillWarning />
          </Wrapper>
          <Text>{props.text}</Text>
          <Button>
            <IoClose />
          </Button>
        </Warning>
      </Content>
    </Container>
  );
};

export default Notification;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 8px;
  z-index: 100;
  width: auto;
  min-width: 400px;
  transition: transform 1s ease-in-out;
  transform: translateX(450%);

  &.active {
    transform: translateX(0%);
  }
`;

const Content = styled.div`
  height: 64px;
  display: block;
`;

const Warning = styled.div`
  display: flex;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  color: rgb(255, 250, 230);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 18%) 0px 3px 8px;
  background-color: rgb(255, 139, 0) !important;
  width: 36px;
  padding: 8px 0;
  height: 100%;
  border-radius: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  position: relative;
  justify-content: center;
  align-items: center;
  svg {
    position: absolute;
    top: 7px;
    height: 25px;
    width: 20px;
  }
`;

const Text = styled.div`
  padding: 8px 12px;
  display: block;
  line-height: 1.4;
  min-height: 40px;
  width: 100%;
  color: #ff8b00;
  background-color: rgb(255, 250, 230);
`;

const Button = styled.div`
  cursor: pointer;
  background-color: rgb(255, 250, 230);
  width: 35px;
  display: block;
  position: relative;
  border-radius: 0 5px 5px 0;
  svg {
    position: absolute;
    top: 5px;
    height: 25px;
    color: #ff8b00;
    opacity: 0.5;
    width: 20px;
    &:hover {
      opacity: 1;
    }
  }
`;
