import styled from "styled-components";
import { ChatsSubHeader } from "../Chat/SideBars.styled";

export const ModalFade = styled.div`
  background-color: #00000050;
  display: grid;
  width: 100vw;
  height: 100vh;
  position: fixed;
  place-items: center;
  font-size: 0.9rem;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.15s linear;
`;

export const Document = styled.div`
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  max-width: ${(props) =>
    props.isForward ? "600px" : props.newGroup ? "550px" : "500px"};
  margin: 1.75rem auto;
  height: 90%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ModalContent = styled.div`
  background: #383f44;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #2b2b2f;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
  position: relative;

  .btn {
    position: absolute;
    padding: 1rem;
    cursor: pointer;
    background-color: transparent;
    color: #00000050;
    border: 0;
    font-size: 1.5rem;
    font-weight: 600;
    right: 0;
    top: -2px;
    outline: none;

    &:hover {
      color: #000000;
    }
  }
`;

export const ModalTitle = styled.div`
  color: #fff;
  margin-bottom: 0;
  line-height: 1.5;

  h5 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
  }
`;

export const ModalBody = styled.div`
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DialogGroupName = styled(ChatsSubHeader)`
  width: 100%;
  padding: 0px 12px 12px 12px;
  height: 100px;
  display: flex;

  div {
    display: flex;
    flex-direction: column;
    width: 100% !important;

    label {
      color: #fff;
      position: relative;
      bottom: 5px;
      font-size: 0.875rem;
    }

    input {
      width: 100% !important;
      border-radius: 5px !important;
      line-height: 1.86 !important;
    }
  }
`;

export const DialogGroupPicture = styled.div`
  width: 100%;
  padding: 12px;
  height: 89px;
  display: flex;
  margin-bottom: 20px;

  div {
    position: relative;
    width: 100%;
    & > label {
      display: block;
      color: #fff;
      padding-bottom: 3px;
      font-size: 0.875rem;
    }

    .custom-file {
      position: relative;

      .custom-file-label {
        cursor: pointer;
        background-color: #2a2a2a;
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.375rem 0.75rem;
        line-height: 1.5;
        left: 0;
        z-index: 1;
        height: calc(1.5em + 0.75rem + 2px);
        font-weight: 400;
        color: #fff;
        border: 1px solid #2a2a2a;
        border-radius: 0.25rem;

        &:after {
          content: "Browse";
          background-color: #383f44;
          border-left: inherit;
          border-radius: 0 0.25rem 0.25rem 0;
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.375rem 0.75rem;
        }
      }

      #profilePictureInput {
        opacity: 0;
        position: absolute;
        z-index: -1;
      }
    }
  }
`;

export const DialogSearch = styled(ChatsSubHeader)`
  width: 100%;
  ${({ newGroup }) =>
    newGroup
      ? `
        padding: 12px 12px 28px 12px;
        height: 48px;
  `
      : `
        padding: 12px 12px 18px 12px;
        height: 78px;
  `}
  display: flex;
  border-bottom: 1px solid #2a2a2a;

  & > div:last-child {
    width: 100%;
    input {
      width: 100%;
    }
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  border-top: 1px solid #2b2b2f;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  font-size: 0.875rem;

  .cancel {
    margin-right: auto;
    color: #adb5bd;
    border: 1px solid transparent;
    padding: 0.4375rem 1.25rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    cursor: pointer;
    background: transparent;
    outline: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .new-group {
    color: #fff;
    background-color: #44a675;
    padding: 0.4375rem 1.25rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    outline: none;

    &:hover {
      background: #389b62;
    }
  }
`;
