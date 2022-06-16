import styled from "styled-components";

export const Setting = styled.div`
  background-color: #323333;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Heading = styled.div`
  padding: 0.75rem 1.5rem 0.75rem 1.5rem;
  background-color: #383f44;
  border-bottom: 1px solid #2b2b2f;
  color: #fff;
  height: 92px;
  margin-left: 1.5px;
  width: 100%;
  padding: 12px 24px;

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    h5 {
      line-height: 2.6;
      margin: 0;
      height: 45px;
      font-weight: 600;
      font-size: 1.09375rem;
    }
    p {
      margin: 0;
      font-size: 0.875rem;
    }
  }
`;

export const Container = styled.div`
  padding: 0 24px;
  display: flex;
  justify-content: center;
  align-items: cener;
  width: 100%;
  padding-top: 24px;
  height: 100%;

  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

export const Col = styled.div`
  padding: 0 15px;
`;

export const Card = styled.div`
  background-color: #383f44;
  border: 1px solid #2b2b2f;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const CardHeader = styled.div`
  background-color: #2a2a2a;
  padding: 0.75rem 1.25rem;
  color: #fff;
  padding: 12px 20px;

  h6 {
    margin: 0;
    margin-bottom: 6px;
    font-size: 0.875rem;
  }
  p {
    margin: 0;
    font-size: 0.75rem;
  }
`;

export const CardBody = styled.div`
  padding: 1.2rem;
  border: 1px solid #2b2b2f;

  .list-group {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    color: #f8f9fa;

    .list-group-item {
      display: flex;

      .media-body {
        width: 100%;
        p {
          font-weight: 400;
          font-size: 0.75rem;
          width: 100%;
          margin: 0;

          &:first-child {
            font-size: 0.875rem;
          }
        }
      }

      .button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .switch-btn {
          position: relative;
          height: 20px;
          width: 40px;
          margin: 0px;
          position: relative;
          background: rgb(136, 136, 136);
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.25s ease 0s;

          & > svg {
            position: absolute;
            left: 3px;
            font-size: 18px;
            opacity: 0;
            transition: opacity 0.25s ease 0s;
          }

          .icon {
            height: 20px;
            width: 22px;
            position: relative;
            pointer-events: none;

            svg {
              position: absolute;
              border-radius: 50%;
              top: 1.5px;
              transition: all 0.25s ease 0s;
            }
          }

          &.active {
            background-color: rgb(0, 136, 0);
            & > svg {
              opacity: 1;
            }
            .icon {
              svg {
                transform: translateX(23px);
                box-shadow: rgb(51, 187, 255) 0px 0px 2px 3px;
              }
            }
          }
        }
      }
    }
  }
`;

export const FormGroup = styled.div`
  padding: 0 15px;
  width: ${({ isAddress }) => (isAddress ? "100%" : "50%")};

  div {
    width: 100%;
    margin-bottom: 1rem;
    display: inline-block;

    label {
      font-size: 0.875rem;
      color: #fff;
    }

    input {
      height: calc(2.6rem + 2px);
      width: 100%;
      display: block;
      font-weight: 400;
      padding: 0.375rem 0.75rem;
      color: #adb5bd;
      background-color: #2a2a2a;
      outline: none;
      border: 1px solid #2a2a2a;
      border-radius: 0.25rem;
      &:focus {
        color: #fff;
      }
      &::placeholder {
        color: #adb5bd;
      }
    }
  }
`;

export const CardFooter = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: #2a2a2a;
  display: flex;
  justify-content: flex-end;

  & > button {
    cursor: pointer;
    font-weight: 400;
    text-decoration: none;
    outline: none;
    padding: 0.4375rem 1.25rem;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 0.25rem;

    &:first-child {
      color: #adb5bd;
      &:hover {
        text-decoration: underline;
      }
    }

    &:last-child {
      color: #fff;
      background-color: #665dfe;
      border: 1px solid #665dfe;

      &:hover {
        background-color: #4237fe;
      }
    }
  }
`;
