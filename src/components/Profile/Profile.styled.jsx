import styled from "styled-components";
import { Avatar } from "../Chat/ChatItems.styled";
import {
  Body,
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
} from "../Friends/Friends.styled";

export const ProfileContainer = styled(Container)`
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  height: calc(100vh - 120px);
  padding: 0;
  padding-top: 12px;
`;

export const ProfileContent = styled(Content)`
  padding: 0;
`;

export const ProfileRow = styled(Row)``;
export const ProfileCol = styled(Col)``;
export const ProfileBody = styled(Body)``;
export const ProfileAvatar = styled(Avatar)``;
export const ProfileItem = styled(Item)``;
export const ProfileIcons = styled(Icons)`
  cursor: pointer;

  div {
    width: 10rem;
    color: #adb5bd;
    border-radius: 3px;
    font-size: 1.3rem;

    svg {
      position: relative;
      top: 1px;
      font-size: 28px;
      margin-right: 3px;
    }

    &:last-child {
      background: #2a2a2a;
      border: 1px solid #2a2a2a;

      &:hover {
        background: #495057;
      }
    }
  }
`;
export const ProfileOptions = styled(Options)``;
export const ProfileRowInfo = styled(RowInfo)``;
export const ProfileListGroup = styled(ListGroup)``;
export const ProfileListItem = styled(ListItem)``;
