import styled from "styled-components";
import ScrollToBottom from "react-scroll-to-bottom";

export const MessageContainer = styled(ScrollToBottom)`
  flex: 1;
  padding: 0.75rem;
  width: 100%;
  max-width: 1320px;
  transition: height 0.35s ease-in-out;
  margin: 0px auto;
  // max-height: 84vh;

  & > div {
    & > div:first-child {
      margin-top: 25px;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 1200px) {
    margin-top: 3rem;
  }
`;

export const MessageOptions = styled.div`
  color: #adb5bd;
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-top: 0.3125rem;
  height: 30px;

  & > div:last-child {
    cursor: pointer;
    color: #f8f9fa;
    font-size: 25px;
    margin-top: 6px;
    &:hover {
      color: #adb5bd;
    }
  }

  & > div:first-child {
    height: 80px;
    width: 80px;
    background-color: #323333 !important;
    border-radius: 50%;

    & > img {
      border-radius: 50%;
      height: 2.15rem;
      width: 2.25rem;
      min-width: 2.25rem;
      position: absolute;
      right: 17px;
      top: 12px;
    }

    &:before {
      display: none;
    }
  }

  & > * {
    margin: 0 0.3125rem;
  }
`;

export const MessageContent = styled.div`
  width: 100%;
  height: 100%;
`;

export const Message = styled.div`
  margin-bottom: 2.25rem;
  font-size: 1.05rem;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isRight ? "flex-end" : "flex-start")};
  overflow-wrap: break-word;
  position: relative;

  ${MessageOptions} {
    flex-direction: ${(props) => (props.isRight ? "row-reverse" : "row")};

    & > div:first-child img {
      right: ${(props) => (props.isRight ? "22px" : "17px")};
    }
  }

  mark {
    background-color: #fcf8e3;
    color: black;
  }
`;

export const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  &:before {
    background-color: #424242;
    content: attr(data-label);
    display: inline-block;
    letter-spacing: 0.0313rem;
    font-size: 0.7875rem;
    padding: 0.125rem 0.5rem;
    margin: 1rem 0;
    border-radius: 0.1875rem;
    border: 1px solid #2b2b2f;
    font-weight: 500;
  }
`;

export const MessageWrap = styled.div`
  position: relative;
`;

export const Content = styled(MessageWrap)`
  background-color: ${({ isRight }) => (isRight ? "#665dfe" : "#383F44")};
  height: 100%;
  color: ${(props) => (props.isRight ? "#ffffff" : "#8094AE")};
  margin-left: 2.25rem;
  margin-right: 2.25rem;
  padding: 1rem 2.25rem;
  border-radius: 1.25rem;
  text-align: left;
  display: inline-block;
  max-width: 25rem;

  .images-row {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 4px 0;

    .lg-react-element {
      display: flex;
    }
  }
  & > span {
    position: relative;
    bottom: ${({ isRight }) => (!isRight ? "5px" : "2px")};
    /* margin-bottom: ; */
  }

  h6 {
    margin: 0;
    color: #fff;
    font-size: 1.075rem;
    margin-bottom: 8px;
  }
`;

export const DropDown = styled.div`
  position: relative;
  cursor: pointer;
`;

export const DropDownContent = styled.div`
  position: absolute;
  inset: 0px auto auto 0px;
  margin: 0px;
  transform: ${({ translate }) => translate};
  min-width: 10rem;
  padding: 0.5rem 0;
  z-index: 3;
  color: #495057;
  text-align: left;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  font-size: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2b2b2b;

  div {
    display: flex;
    padding: 0.5rem 1.5rem;
    width: 100%;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    color: #ffffff;
    text-decoration: none;
    svg {
      height: 1.125rem;
      width: 1.125rem;
      margin-right: 0.75rem;
      line-height: 1.2;
    }

    &:hover {
      background-color: #383f44;
      color: rgba(197, 201, 223, 0.8);
    }

    &.text-danger {
      color: #ff337c !important;
      & > svg {
        color: #ff337c !important;
      }
    }
  }
`;

export const ReplyHeader = styled.h4`
  margin: 0;

  .role {
    padding: 0 42px 0 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #adb5bd;
    font-weight: 400;

    svg {
      margin-right: 12px;
    }
  }
`;

export const ForwardHeader = styled(ReplyHeader)`
  margin-bottom: 10px;
`;

export const ReplyContent = styled.div`
  .content {
    padding: 0 42px 0 22px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-style: italic;
      position: relative;
      height: auto;
      background-color: #4e4f5030;
      color: #adb5bd;
      margin-left: 2.25rem;
      margin-right: 2.25rem;
      padding: 1rem 2.25rem;
      border-radius: 1.25rem;
      text-align: left;
      display: inline-block;
      max-width: 25rem;
      left: ${(props) => (props.isRight ? "42px" : "-23px")};
      bottom: -8px;

      svg {
        margin-left: 8px;
        position: relative;
        top: 2px;
      }
    }
  }
`;
