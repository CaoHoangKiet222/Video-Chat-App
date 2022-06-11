import styled from "styled-components";
import { Card } from "../ChatBar/InfoBar/InfoBar.styled";

export const CardFriends = styled(Card)`
  max-height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 15px;
  max-width: 1320px;
`;

export const Row = styled.div`
  width: 100%;
  margin-right: -15px;
  // margin-left: -15px;
`;

export const Col = styled.div`
  position: relative;
  width: 100%;
  padding: 0 15px;
  max-width: 1320px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #383f44;
  position: relative;
  background-image: url("/images/card-bg.svg");
  margin-bottom: 1.5rem;
  min-height: 1px;
  padding: 1.25rem;
  border: 1px solid #2b2b2f;
  border-radius: 0.25rem;
  align-items: center;
  justify-content: center;

  & > div:first-child {
    height: 5rem;
    width: 5rem;
    min-width: 5rem;
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 10%);
    border-radius: 50%;
    margin-bottom: 1.5rem;

    &:before {
      display: none;
    }
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h5 {
    color: #fff;
    margin: 0 0 6.75px;
    line-height: 1.5;
    font-size: 20px;
  }
`;

export const Icons = styled.div`
  margin-top: 0.75rem;
  display: flex;

  p {
    background-color: #665dfe;
    color: #f8f9fa;
    border-radius: 0.25rem;
    width: 10rem;
    text-align: center;
    margin: 0;
    line-height: 1.8rem;
  }

  div {
    height: 3rem;
    width: 3rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f8f9fa;
    margin: 0 0.75rem;
    border-radius: 50%;
    transition: all 0.15s ease-in-out;
    font-size: 1.575rem;

    &:first-child {
      background-color: #665dfe;
      border-color: #665dfe;
      & > svg {
        margin-left: 2.5px;
      }
      &:hover {
        background-color: #4237fe;
      }
    }
    &:last-child {
      background-color: #44a675;
      border-color: #44a675;

      &:hover {
        background-color: #398b62;
      }
    }
  }
`;

export const Options = styled.div`
  position: absolute;
  top: 0.7rem;
  width: 22.5px;
  height: 36px;
  color: #adb5bd;
  right: 1.825rem;
  display: block;
  font-size: 25px;
`;
export const RowInfo = styled.div`
  margin-right: -15px;
  // margin-left: -15px;
  width: 100%;
`;

export const ListGroup = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  margin-top: 0;
  list-style: none;
  margin-bottom: 1rem;

  &:last-child {
    border-bottom-width: 0;
    border-bottom-right-radius: calc(0.25rem - 1px);
    border-bottom-left-radius: calc(0.25rem - 1px);
  }
  &:first-child {
    border-top-width: 0;
    border-top-left-radius: calc(0.25rem - 1px);
    border-top-right-radius: calc(0.25rem - 1px);
  }
`;

export const ListItem = styled.li`
  background: #383f44;
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  border: 1px solid #2b2b2f;
  border-bottom: 0;
  height: 79px;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.type === "Calls" ? "1rem" : "0")};

  &:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  &:last-child {
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  & > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #f8f9fa;
    width: 100%;

    p {
      width: 100%;
      margin: 0;
      &:first-child {
        font-size: 0.95rem;
      }
      &:last-child {
        font-size: 1rem;
      }
    }
    a {
      width: 100%;
      color: #665dfe;
      font-size: 1.05rem;
    }
  }

  & > svg {
    margin-top: 13px;
    display: flex;
    color: #adb5bd;
    height: 1.25rem;
    width: 1.25rem;
  }
`;
