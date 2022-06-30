import styled from "styled-components";

export const LoadingSpinner = styled.div`
  display: inline-block;
  ${({ newGroup, settings }) =>
    newGroup
      ? `
  width: 50px;
  height: 10px;
  padding-left: 12px;
  padding-bottom: 20px;
  `
      : settings
      ? `
  width: 35px;
  height: 35px;
  padding-bottom: 4px;
  `
      : `
  width: 80px;
  height: 80px;
  padding-left: 20px;
  padding-top: 4px;
  `}

  z-index: 2;

  &:after {
    content: " ";
    display: block;
    ${({ newGroup, settings }) =>
      newGroup
        ? `
    width: 20px;
    height: 20px;
    margin-top: -2px;
    margin-right: 1px;
  `
        : settings
        ? `
    width: 20px;
    height: 20px;
    margin-top: 4.3px;
    margin-left: 4px;
  `
        : `
    width: 30px;
    height: 30px;
    margin-top: 3px;
  `}

    border-radius: 50%;
    border: 5px solid white;
    border-color: white transparent white transparent;
    animation: spinner 1.2s linear infinite;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
