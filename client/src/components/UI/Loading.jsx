import styled from "styled-components";

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  padding-left: 20px;
  padding-top: 4px;
  z-index: 2;

  &:after {
    content: " ";
    display: block;
    width: 30px;
    height: 30px;
    margin-top: 3px;
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
