import styled from "styled-components";

export const Card = styled.div`
  height: 100%;
  width: 100%;
  background: #323333;
`;

export const Msger = styled.section`
  // check here
  height: 100%;
  display: grid;
  grid-template-rows: 7vh 86vh 7vh;
  border-radius: 5px;
  color: #fff;

  @media (min-width: 1200px) {
    grid-template-rows: 5vh 90vh 5vh;
  }
`;
