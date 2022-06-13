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
`;

export const DialogItem = styled(ChatItem)`
  & > a:hover {
    background-color: #665dfe;
  }
`;

export const DialogContent = styled(ChatContent)``;

export const DialogInfo = styled(ChatInfo)``;

export const DialogText = styled(ChatText)``;
