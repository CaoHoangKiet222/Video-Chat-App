import styled from "styled-components";
import { RowInfo } from "../Friends/Friends.styled";

export const Main = styled.div`
  background-color: #323333;
  max-height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Calls = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5rem;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 15px;
  max-width: 1320px;
`;

export const CallLogs = styled(RowInfo)``;
