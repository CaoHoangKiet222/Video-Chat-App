import { useEffect, useState } from "react";
import {
  Content,
  Divider,
  DropDown,
  DropDownContent,
  Message,
  MessageOptions,
  MessageWrap,
} from "./Main.styled";
import { Avatar } from "../../Chat/ChatItems.styled";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { formatDate, formatHour, postData } from "../../../utilities/utilities";
import {
  IoCopyOutline,
  IoReturnUpForward,
  IoReturnUpBack,
} from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Messages = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

  useEffect(() => {
    const checkClickOutSide = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", checkClickOutSide);
    return () => {
      document.removeEventListener("click", checkClickOutSide);
    };
  }, [showMenu]);

  useEffect(() => {
    chatSocket.on("deleteMessage", (message) => {
      props.setMessages((prepMess) => {
        const index = prepMess.findIndex((mess) => mess._id === message._id);
        index !== -1 && prepMess.splice(index, 1);
        return [...prepMess];
      });
    });

    return () => {
      chatSocket.off("deleteMessage");
    };
  }, [chatSocket, props]);

  const dropDownHandle = () => {
    setShowMenu(true);
  };

  const deleteHandler = () => {
    chatSocket.emit("deleteMessage", {
      message: props.message,
      conversationId: props.conversationId,
    });

    props.setMessages((prepMess) => {
      prepMess.splice(
        prepMess.findIndex((mess) => mess._id === props.message._id),
        1
      );
      return [...prepMess];
    });

    postData(`${ENDPOINT_SERVER}/delete-message`, "delete", {
      message: props.message,
      conversationId: props.conversationId,
    });
  };

  return (
    <Message isRight={props.isRight}>
      {props.timeChange && (
        <Divider data-label={formatDate(props.time)}></Divider>
      )}
      <MessageWrap>
        <Content isRight={props.isRight}>
          <span>{props.message.content}</span>
        </Content>
      </MessageWrap>
      <MessageOptions>
        <Avatar>
          <img src="/images/user.jpg" alt="" />
        </Avatar>
        <span>{formatHour(props.time)}</span>
        <span>Edited</span>
        <DropDown onClick={dropDownHandle}>
          <BiDotsHorizontalRounded />
          {showMenu && (
            <DropDownContent>
              <CopyToClipboard text={props.message.content}>
                <a href="#">
                  <IoCopyOutline></IoCopyOutline>
                  <span>Copy</span>
                </a>
              </CopyToClipboard>
              <a href="#">
                <IoReturnUpBack></IoReturnUpBack>
                <span>Reply</span>
              </a>
              <a href="#">
                <IoReturnUpForward></IoReturnUpForward>
                <span>Forward</span>
              </a>
              <a href="#">
                <AiOutlineStar></AiOutlineStar>
                <span>Favourite</span>
              </a>
              <a href="#" className="text-danger" onClick={deleteHandler}>
                <RiDeleteBinLine></RiDeleteBinLine>
                <span>Delete</span>
              </a>
            </DropDownContent>
          )}
        </DropDown>
      </MessageOptions>
    </Message>
  );
};

export default Messages;
