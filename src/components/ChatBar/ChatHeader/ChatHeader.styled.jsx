import styled from "styled-components";
import { ChatContent, ChatInfo } from "../../Chat/ChatItems.styled";

export const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;

  // check here
  height: 99px;
  min-height: 4vh;
  z-index: 1;

  padding: 0.75rem 2.25rem;
  border-bottom: 1px solid #2b2b2f;
  background: #323333;

  @media (max-width: 1200px) {
    width: 100vw;
  }
`;

export const Media = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const MediaContent = styled(ChatContent)`
  width: 100%;

  & > small {
    color: #adb5bd;
    font-size: 80%;
    font-weight: 400;
  }
`;

export const MediaInfo = styled(ChatInfo)``;

export const MediaNav = styled.ul`
  background: #323333;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 208px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  li {
    width: 100%;
    margin-top: 10px;
    font-size: 25px;
    margin-left: 2.375rem;

    svg {
      & > path {
        color: #adb5bd;
      }
      &:hover > path {
        color: #495057;
      }
    }
  }
`;

export const Body = styled.div`
  display: flex;
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
`;
