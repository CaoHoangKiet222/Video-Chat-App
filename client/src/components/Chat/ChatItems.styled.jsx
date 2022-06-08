import styled from "styled-components";

export const ChatItem = styled.li`
  margin: 0.75rem 0;
  cursor: pointer;
  max-width: 100%;
  position: relative;
  overflow: hidden;

  & > a {
    display: flex;
    border: 1px solid #4b4b60;
    border-radius: 0.25rem;
    transition: all 0.3s ease;
    padding: 1rem 1.25rem;
    align-items: center;
    color: #fff;
    text-decoration: none;

    &:hover {
      border-color: #665dfe;
    }
  }
`;

export const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  min-width: 3rem;
  position: relative;
  background-color: transparent;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &:before {
    ${(props) =>
      !props.isSkeleton &&
      `
    background: #44a675;
    content: "";
    display: block;
    position: absolute;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    top: 1px;
    right: 1px;
    // border: 3px solid #fff;
    `}
  }
`;
export const ChatContent = styled.div`
  padding-left: 0.875rem;
  transition: all 0.4s;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ChatInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.375rem;
  line-height: 1.8;
  width: 100%;

  h6 {
    margin: 0;
    font-size: 0.875rem;
    margin-right: auto;
  }

  div {
    color: #adb5bd;
  }
`;
export const ChatText = styled.div`
  display: flex;

  p {
    color: #f8f9fa;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    ${(props) =>
      props.type === "Friends" &&
      `
         width: 100%;
         margin-left: 7px;
         line-height: 1.4;
      `}
  }
`;
