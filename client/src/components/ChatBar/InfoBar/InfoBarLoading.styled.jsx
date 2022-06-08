import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => (props.background ? props.background : "#14141410")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
