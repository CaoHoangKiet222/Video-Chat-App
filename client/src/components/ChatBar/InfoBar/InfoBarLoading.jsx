import React from "react";
import { TikTokSpinner } from "../../UI/TikTokLoading";
import { Container } from "./InfoBarLoading.styled";

const InfoBarLoading = ({ background }) => {
  return (
    <Container background={background}>
      <TikTokSpinner />
    </Container>
  );
};

export default InfoBarLoading;
