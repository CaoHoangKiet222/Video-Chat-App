import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const MeetingMain = styled.div`
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const MeetingTopControls = styled.div`
  display: flex;
  justify-content: flex-end;
  z-index: 100;
  background: #363e47;
  height: 95px;

  &.transparent {
    width: 100%;
    height: 0;
  }
`;

export const PanelControl = styled.div`
  position: relative;
  color: #ffffff;
  font-size: 20px;
  min-width: 60px;
  height: 95px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #303841;
  }
`;

export const Peers = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 95px;
  z-index: 1;
  overflow: hidden;
`;

export const Videos = styled.div`
  min-width: 141px;
  position: relative;

  & > video {
    object-fit: cover;
    background-color: black;
    z-index: 100;
    width: 140px;
    min-width: 140px;
    height: ${(props) => (!props.isShowTop ? "105px" : "95px")};
    cursor: pointer;
    margin: 0 1px;
  }
`;

export const Streams = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
`;

export const MeetingBottomControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 0 18px;
  background-color: #f7f7f7;
`;

export const CommonControl = styled.div`
  max-width: 80px;
  min-width: 50px;
  width: 7vw;
  height: 50px;
  background-color: #363e47;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #303841;
  }

  &.close {
    background: #eb1819;
    height: 52px;

    &:hover {
      background-color: #d61314;
    }
  }
`;
