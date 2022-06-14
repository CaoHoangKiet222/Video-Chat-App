import styled from "styled-components";
import {
  ChatContent,
  ChatInfo,
  ChatItem,
  ChatText,
} from "../Chat/ChatItems.styled";
import { ChatsList } from "../Chat/SideBars.styled";

export const DialogList = styled(ChatsList)`
  max-height: 400px;
  ${(props) => props.isForward && "padding: 0"};
`;

export const DialogItem = styled(ChatItem)`
  ${(props) =>
    !props.isForward
      ? `
      & > a:hover {
        background-color: #665dfe;
      }
    `
      : `
  background-color: #383f44;
  margin: 0;
  padding: 0;

  & > a {
  cursor: auto;
    border: 0;
  }
    `}
`;

export const DialogContent = styled(ChatContent)``;

export const DialogInfo = styled(ChatInfo)``;

export const DialogText = styled(ChatText)``;

export const SentButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    cursor: ${(props) => (props.isSent ? "not-allowed" : "pointer")};
    color: ${(props) => (props.isSent ? "#ffffff4d" : "#2d88ff")};
    background-color: ${(props) => (props.isSent ? "#2a2a2a95" : "#2d88ff33")};
    height: 40px;
    border-radius: 6px;
    padding: 0 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 600;

    &:hover {
      opacity: ${(props) => (props.isSent ? "none" : "0.4")};
    }

    .envelope {
      margin-right: 3px;
      position: relative;
      top: 1.2px;
    }
    .text {
      position: relative;
      top: -1px;
      margin-left: 3px;
    }
  }
`;
