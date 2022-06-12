import styled from "styled-components";

export const InputForm = styled.form`
  display: flex;
  /* flex-direction: column; */
  background: #323333;
  padding: 0.75rem 2.25rem;
  border-top: 1px solid #2b2b2f;

  // check here
  width: calc(100vw - 4.375rem - 472px);
  position: fixed;
  bottom: 0;
  height: 89px;
  min-height: 4vh;
  @media (max-width: 1200px) {
    width: 100%;
  }

  .container {
    display: flex;
    width: 100%;

    input {
      width: 100%;
      height: 100%;
      padding: 6px 12px;
      background: #2a2a2a;
      color: #fff;
      border: none;
      font-size: 1.175rem;
      outline: none;
    }

    button {
      cursor: pointer;
      width: 5rem;
      outline: none;
      border: none;
      padding: 0.1rem;
      margin-left: 0.5rem;
      border-radius: 4px;
      transition: background 0.23s;
      background-color: #665dfe;

      &:hover {
        background: #4237fe;
      }
      svg {
        font-size: 1.5rem;
        color: #fff;
      }
    }
  }
`;

export const ReplyForm = styled.div`
  position: absolute;
  background-color: #323333;
  width: 100%;
  max-width: calc(100vw - 4.375rem - 472px);
  height: 100%;
  padding: 10px 3rem 3px 15px;
  font-size: 0.9375rem;
  border-top: 1px solid #2b2b2f;
  top: -89px;
  left: 0;

  .container {
    .text-reply {
      width: 100%;
      padding: 10px 15px 3px 15px;

      .text-reply-container > div {
        span {
          color: #e4e6eb;
          font-size: 1.175rem;
          display: inline-block;
        }

        .text-muted {
          width: 100%;
          color: #b0b3b8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .close-btn {
      font-size: 2rem;
      color: #b0b3b8;
      cursor: pointer;

      &:hover {
        color: #ffffff;
      }
    }
  }

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;
