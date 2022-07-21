import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background: #323333;
`;

export const Msger = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  transition: all 0.1s ease-in-out;
  grid-template-rows: ${({ showSearchBox }) =>
    !showSearchBox
      ? "7vh 0px calc(93vh - 89px) 89px"
      : "99px 69px calc(100vh - 99px - 69px - 89px) 89px"};
  border-radius: 5px;
  color: #fff;
`;
