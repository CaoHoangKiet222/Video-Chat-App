import styled from "styled-components";

export const Media = styled.div`
  display: flex;
  flex-direction: row !important;

  .avatar {
    background: #665dfe;
    color: #fff;
    height: 3rem;
    width: 3rem;
    min-width: 3rem;
    display: inline-block;
    position: relative;
    border-radius: 50%;
    margin-right: 0.75rem;
    span {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .media-body {
    width: 100%;

    h6 {
      margin: 0;
      margin-bottom: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    div {
      display: flex;
      p {
        display: block;
        width: auto !important;
      }
      span {
        display: block;
        margin-right: 0.75rem;
        margin-left: 0.75rem;
      }
    }
  }
  .media-options {
    width: 46px;
    height: 48px;

    button {
      cursor: pointer;
      background-color: transparent;
      color: #adb5bd !important;
      width: calc(1.5rem + 2px);
      line-height: 1.5rem;
      border: 0;
      outline: none;
      svg {
        font-size: 0.875rem;
        height: 2.95rem;
        width: 1.6rem;
      }
    }
  }
`;
