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
      ? "7vh 0vh 86vh 7vh"
      : "99px 69px calc(93vh - 99px - 69px) 7vh"};
  border-radius: 5px;
  color: #fff;
`;
