import styled from "styled-components";
import { ChatItem } from "../Chat/ChatItems.styled";
import { ChatsList, ChatsSubHeader } from "../Chat/SideBars.styled";

export const ModalFade = styled.div`
  background-color: #00000050;
  display: grid;
  width: 100vw;
  height: 100vh;
  position: fixed;
  place-items: center;
  font-size: 0.9rem;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.15s linear;
`;

export const Document = styled.div`
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  max-width: ${(props) => (props.isForward ? "600px" : "500px")};
  margin: 1.75rem auto;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ModalContent = styled.div`
  background: #383f44;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #2b2b2f;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
  position: relative;

  .btn {
    position: absolute;
    padding: 1rem;
    cursor: pointer;
    background-color: transparent;
    color: #00000050;
    border: 0;
    font-size: 1.5rem;
    font-weight: 600;
    right: 0;
    top: -2px;
    outline: none;

    &:hover {
      color: #000000;
    }
  }
`;

export const ModalTitle = styled.div`
  color: #fff;
  margin-bottom: 0;
  line-height: 1.5;

  h5 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
  }
`;

export const ModalBody = styled.div`
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DialogSearch = styled(ChatsSubHeader)`
  width: 100%;
  padding: 12px;
  height: 68px;
  border-bottom: 1px solid #2b2b2f;

  & > div:last-child {
    width: 100%;
    input {
      width: 100%;
    }
  }
`;
