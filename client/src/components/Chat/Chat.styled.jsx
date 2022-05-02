import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
`;

export const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 77px 472px auto;

  @media (max-width: 1200px) {
    grid-template-columns: auto;
  }
`;
