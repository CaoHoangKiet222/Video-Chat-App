import styled from "styled-components";

export const PeerInfo = styled.div`
  ${(props) =>
    props.type === "peer-info"
      ? `
  min-width: 135px;
  width: 135px;
  height: 95px;
  cursor: pointer;
  margin: 0 8px;
  z-index: 1;

  &.main-peer {
    border: 3px solid #da7d02;
    border-radius: 8px
  }
  `
      : props.type === "video-container" &&
        `
  width: 100%;
  height: 100%;

  `}
`;

export const RemotePeer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

export const Name = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 30px;
  font-weight: 700;
  color: #666;
  font-size: ${(props) => props["font-size"]};
  padding: ${(props) => props.padding};
`;

export const Img = styled.div`
  height: ${(props) => props.height};
  width: ${(props) => props.width};

  img {
    border-radius: 50%;
    height: inherit;
    width: inherit;
    object-fit: cover;
  }
`;

export const Status = styled(Name)`
  align-items: flex-start;
  font-size: ${(props) => props["font-size"]};
  padding: ${(props) => props.padding};
`;
