import styled from "styled-components";

export const InputForm = styled.form`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background: #323333;
  padding: 0.75rem 2.25rem;
  border-top: 1px solid #2b2b2f;
  text-align: center;

  & > .block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    div.btn {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #b0b3b8;
      background-color: #3e4042;
      border-radius: 10px;
      cursor: pointer;
      height: 36px;
      width: 440px;
      transition: all 0.1s ease-in;

      span {
        font-size: 16px;
      }

      &:hover {
        color: #fff;
        background-color: #8a8d91;
      }
    }

    span {
      font-size: 22px;
    }
  }

  // check here
  height: 100%;
  @media (max-width: 1200px) {
    width: 100%;
  }

  .container {
    display: flex;
    width: 100%;
    position: relative;

    & > div.input-group {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-right: 1rem;
      font-size: 1.7rem;
      color: #adb5bd;

      & .dropdown > div {
        position: absolute;
        bottom: 70px;
        left: 0;
      }

      &:hover .dropdown > svg {
        opacity: 0.6;
      }
    }

    & > div.image-attach,
    & > div.file-attach {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1rem;
      color: #adb5bd;

      label {
        cursor: pointer;
        font-size: 1.4rem;

        &:hover {
          opacity: 0.6;
        }
      }
    }

    .input {
      padding: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      input {
        width: 100%;
        height: 100%;
        min-height: 40px;
        padding: 6px 12px;
        background: #2a2a2a;
        color: #fff;
        border: none;
        font-size: 1.175rem;
        outline: none;
      }
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

export const FilesContent = styled.div`
  position: absolute;
  background-color: #323333;
  width: 100%;
  height: 100%;
  padding: 10px 3rem 3px 15px;
  font-size: 0.9375rem;
  border-top: 1px solid #2b2b2f;
  bottom: 89px;
  right: 0;

  .container {
    .content {
      display: flex;

      .upload-another-image,
      .upload-another-attach {
        width: 68px;
        height: 68px;
        font-size: 2.7rem;
        margin-left: 24px;
        position: relative;

        & > label {
          width: inherit;
          height: inherit;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #b0b3b8;
          background-color: #3e4042;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.1s ease-in;

          &:hover {
            color: #fff;
            background-color: #8a8d91;
          }
        }
      }

      .attachments {
        width: 210px;
        height: 68px;
        border-radius: 10px;
        margin: 0px 12px;
        position: relative;
        background-color: #d6d9dd;

        .content-attachment {
          display: flex;
          padding: 4px 8px;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 0.9375rem;

          .attachment {
            margin-left: 10px;
            font-size: 1rem;
            font-weight: 500;
            word-wrap: break-word;
            position: relative;
            line-height: 1.2em;
            max-height: 3.6em;
            text-align: justify;
            text-overflow: ellipsis;
            overflow: hidden;
            max-width: 69%;
          }

          .icon {
            background-color: #242526;
            border-radius: 50%;
            padding-left: 7px;
            min-width: 45px;
            min-height: 45px;
            display: flex;
            justify-items: center;
            align-items: center;

            svg {
              font-size: 30px;
            }
          }
        }

        .close-btn {
          position: absolute;
          top: -14px;
          right: -13px;
          font-size: 1.7rem;
          color: #b0b3b8;
          background-color: #3e4042;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;

          svg {
            position: relative;
            /* left: 4px; */
          }

          &:hover {
            color: #fff;
            background-color: #8a8d91;
          }
        }
      }

      .image {
        width: 68px;
        height: 68px;
        border-radius: 10px;
        margin: 0px 12px;
        position: relative;

        img {
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .close-btn {
          position: absolute;
          top: -14px;
          right: -13px;
          font-size: 1.7rem;
          color: #b0b3b8;
          background-color: #3e4042;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;

          svg {
            position: relative;
            /* left: 4px; */
          }

          &:hover {
            color: #fff;
            background-color: #8a8d91;
          }
        }
      }
    }
  }

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;
