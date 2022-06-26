import { useEffect, useState } from "react";
import {
  Content,
  Divider,
  DropDown,
  DropDownContent,
  ForwardHeader,
  Message,
  MessageOptions,
  MessageWrap,
  ReplyContent,
  ReplyHeader,
} from "./Main.styled";
import { Avatar } from "../../Chat/ChatItems.styled";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  closeComponent,
  formatDate,
  formatHour,
  postData,
} from "../../../utilities/utilities";
import {
  IoCopyOutline,
  IoReturnUpForward,
  IoReturnUpBack,
} from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import { RiDeleteBinLine, RiShareForwardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { replyActions } from "../../../store/reply-slice";
import { BsReplyAllFill } from "react-icons/bs";
import { forwardActions } from "../../../store/forward-slice";
import { fetchConversation } from "../../../store/conversations-creator";
import ImagesPreview from "./ImagesPreview";
import Attachments from "./Attachments";

const Messages = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const { user } = useSelector((state) => state.user);
  const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const dispatch = useDispatch();

  useEffect(() => {
    return closeComponent(showMenu, setShowMenu);
  }, [showMenu]);

  const dropDownHandle = () => {
    setShowMenu(true);
  };

  const deleteHandler = async () => {
    chatSocket.emit(
      "deleteMessage",
      {
        message: props.message,
        conversationId: props.conversationId,
      },
      () => {
        props.setMessages((prepMess) => {
          prepMess.splice(
            prepMess.findIndex((mess) => mess._id === props.message._id),
            1
          );
          return [...prepMess];
        });

        dispatch(fetchConversation());
      }
    );

    await postData(`${ENDPOINT_SERVER}/delete-message`, "delete", {
      message: props.message,
      conversationId: props.conversationId,
    });
  };

  const replyHandler = () => {
    dispatch(
      replyActions.setReply({
        reply: {
          isClick: true,
          message: props.message,
        },
      })
    );
  };

  const forwardHandler = () => {
    // console.log(props);
    dispatch(
      forwardActions.setForward({
        forward: {
          message: props.message,
          isClick: true,
        },
      })
    );
  };

  return (
    <Message isRight={props.isRight}>
      {props.timeChange && (
        <Divider data-label={formatDate(props.time)}></Divider>
      )}
      {props.message?.reply !== null && (
        <>
          <ReplyHeader>
            <div className="role">
              <BsReplyAllFill />
              <span>
                {props.message.reply.message.senderId._id ===
                props.message.senderId._id
                  ? props.isRight
                    ? "You replied to yourself"
                    : props.message.senderId.name + " replied to themself"
                  : props.isRight
                  ? "You replyed to " +
                    props.message.reply.message.senderId.name
                  : props.message.reply.message.senderId._id === user._id
                  ? props.message.senderId.name + " replyed to you"
                  : props.message.senderId.name +
                    " replyed to " +
                    props.message.reply.message.senderId.name}
              </span>
            </div>
          </ReplyHeader>
          <ReplyContent isRight={props.isRight}>
            <div className="content">
              <span>{props.message.reply.message.content}</span>
            </div>
          </ReplyContent>
        </>
      )}
      {props.message.isForward && props.message.senderId._id !== user._id && (
        <ForwardHeader>
          <div className="role">
            <RiShareForwardFill />
            <span>{props.message.senderId.name + " forwarded a message"}</span>
          </div>
        </ForwardHeader>
      )}
      <MessageWrap>
        <Content isRight={props.isRight}>
          {!props.isRight && props.isGroup && (
            <h6>{props.message.senderId.name}</h6>
          )}
          {props.message.content && <span>{props.message.content}</span>}

          {props.message.files?.images.length !== 0 && (
            <div className="images-row">
              {props.message.files?.images.map((url, index) => {
                return (
                  <ImagesPreview
                    url={url}
                    key={index}
                    isRight={props.isRight}
                  />
                );
              })}
            </div>
          )}
          {/* <Attachments isRight={props.isRight} /> */}
        </Content>
      </MessageWrap>
      <MessageOptions>
        <Avatar>
          <img src="/images/user.jpg" alt="" />
        </Avatar>
        <span>{formatHour(props.time)}</span>
        <DropDown onClick={dropDownHandle}>
          <BiDotsHorizontalRounded />
          {showMenu && (
            <DropDownContent translate="translate(0px, 25px)">
              <CopyToClipboard text={props.message.content}>
                <a href="#">
                  <IoCopyOutline></IoCopyOutline>
                  <span>Copy</span>
                </a>
              </CopyToClipboard>
              <a href="#" onClick={replyHandler}>
                <IoReturnUpBack></IoReturnUpBack>
                <span>Reply</span>
              </a>
              <a href="#" onClick={forwardHandler}>
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
