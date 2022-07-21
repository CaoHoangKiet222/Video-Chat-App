import React from "react";
import styled from "styled-components";

const BouncyLoading = () => {
  return (
    <Loader>
      <Ball></Ball>
      <Ball></Ball>
      <Ball></Ball>
    </Loader>
  );
};

export default BouncyLoading;

const Loader = styled.div`
  width: 80px;
  height: 55px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
`;

const Ball = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  transform: translateY(-15px);
  animation: bounce 0.5s alternate infinite;
  &:nth-child(2) {
    animation-delay: 0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0.32s;
  }

  @keyframes bounce {
    from {
      transform: translateY(-12px) scaleX(1.15);
    }
    to {
      transform: translateY(-35px) scaleX(1);
    }
  }
`;
