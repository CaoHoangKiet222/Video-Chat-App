import styled from "styled-components";

export const TikTokSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  position: relative;
  z-index: 1;
  &::before,
  &::after {
    content: "";
    width: inherit;
    height: inherit;
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: multiply;
    animation: rotate 1s infinite cubic-bezier(0.77, 0, 0.175, 1);
  }

  &::before {
    background-color: #383f44;
  }

  &::after {
    background-color: #665dfe;
    animation-delay: 0.5s;
  }

  @keyframes rotate {
    0%,
    100% {
      left: 95px;
    }
    25% {
      transform: scale(0.3);
    }
    50% {
      left: 0;
    }
    75% {
      transform: scale(1);
    }
  }
`;
