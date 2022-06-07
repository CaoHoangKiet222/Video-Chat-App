import React from "react";
import { TikTokSpinner } from "../../UI/TikTokLoading";
import { Container } from "./InfoBarLoading.styled";

const InfoBarLoading = () => {
  return (
    <Container>
      <TikTokSpinner />
    </Container>
  );
};

export default InfoBarLoading;
