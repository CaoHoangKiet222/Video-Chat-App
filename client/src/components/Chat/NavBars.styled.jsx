import styled from "styled-components";

export const NavBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0;
  background-color: #665dfe;
  justify-content: center;

  & > a {
    height: 43.5px;
    width: 43.5px;
    padding: 0.375rem;
    display: inline-block;
    border-radius: 0.25rem;
    background-color: #f8f9fa;
    &:hover {
      background-color: #dae0e5;
    }

    svg {
      height: 30px;
      width: 30px;

      path {
        color: #665dfe;
      }
    }
  }

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const MainNav = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 27px;
  height: 100%;
  align-items: center;

  a {
    display: block;
    transition: all 0.2s ease;
    font-size: 26px;
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    color: #0d090898;
    &.active > svg {
      color: #d5d5e3;
    }

    &:hover {
      color: #fff;
    }
  }
`;
