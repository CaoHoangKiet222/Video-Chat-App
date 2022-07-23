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
} from "../../../utilities/utilities";
import {
  IoCopyOutline,
  IoReturnUpForward,
  IoReturnUpBack,
} from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import {
  RiAttachment2,
  RiDeleteBinLine,
  RiShareForwardFill,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { replyActions } from "../../../store/reply-slice";
import { BsReplyAllFill } from "react-icons/bs";
import { forwardActions } from "../../../store/forward-slice";
import { fetchConversation } from "../../../store/conversations-creator";
import ImagesPreview from "./ImagesPreview";
import Attachments from "./Attachments";
import { ImImages } from "react-icons/im";
import Swal from "sweetalert2";
import Mark from "mark.js";
import Gallery from "../../ImageGallery/Gallery";

const Messages = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const chatSocket = useSelector((state) => state.socket.chatSocket);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const instance = new Mark(
      document.querySelectorAll(["span.hightlight", "h6.file-text"])
    );

    instance.unmark({
      done: () => {
        instance.mark(props.searchName);
      },
    });
  }, [props.searchName]);

  useEffect(() => {
    return closeComponent(showMenu, setShowMenu);
  }, [showMenu]);

  const dropDownHandle = () => {
    setShowMenu(true);
  };

  const deleteHandler = async () => {
    if (props.isRight) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your message has been deleted.", "success");
          chatSocket.emit(
            "deleteMessage",
            {
              message: props.message,
              conversationId: props.conversationId,
            },
            () => {
              props.setMessages((preMess) => {
                preMess.splice(
                  preMess.findIndex((mess) => mess._id === props.message._id),
                  1
                );
                preMess.forEach((mess) => {
                  if (
                    mess.reply !== null &&
                    mess.reply.message_id === props.message._id
                  ) {
                    mess.reply = null;
                  }
                });
                return [...preMess];
              });

              dispatch(fetchConversation());
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: "You don't have any permission to delete user's message",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };

  const replyHandler = () => {
    dispatch(
      replyActions.setReply({
        reply: {
          isClick: true,
          message_id: props.message._id,
          content: props.message.content,
          files: {
            haveImgs: props.message.files.images.length > 0,
            haveAttachments: props.message.files.attachments.length > 0,
          },
          senderId: props.message.senderId,
        },
      })
    );
  };

  const forwardHandler = () => {
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
    <Message isRight={props.isRight} id={props.message._id}>
      {props.timeChange && (
        <Divider data-label={formatDate(props.time)}></Divider>
      )}
      {props.message?.reply !== null && (
        <>
          <ReplyHeader>
            <div className="role">
              <BsReplyAllFill />
              <span>
                {props.message.reply?.senderId._id ===
                props.message.senderId?._id
                  ? props.isRight
                    ? "You replied to yourself"
                    : props.message.senderId.name + " replied to themself"
                  : props.isRight
                  ? "You replyed to " + props.message.reply.senderId.name
                  : props.message.reply.senderId._id === user._id
                  ? props.message.senderId.name + " replyed to you"
                  : props.message.senderId.name +
                    " replyed to " +
                    props.message.reply.senderId.name}
              </span>
            </div>
          </ReplyHeader>
          <ReplyContent isRight={props.isRight}>
            <div className="content">
              <a href={`#${props.message.reply.message_id}`}>
                {props.message.reply.content !== "" ? (
                  <span>{props.message.reply.content}</span>
                ) : props.message.reply.files.haveImgs ? (
                  <span>
                    Images
                    <ImImages />
                  </span>
                ) : (
                  <span>
                    Attachment
                    <RiAttachment2 />
                  </span>
                )}
              </a>
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
          {props.message.content && (
            <span className="hightlight">{props.message.content}</span>
          )}

          {props.message.files?.images.length !== 0 && (
            <div className="images-row">
              <Gallery>
                {props.message.files?.images.map(({ url, fileName }, index) => {
                  return (
                    <ImagesPreview
                      url={url}
                      key={index}
                      fileName={fileName}
                      isRight={props.isRight}
                    />
                  );
                })}
              </Gallery>
            </div>
          )}
          {props.message.files?.attachments.length !== 0 &&
            props.message.files?.attachments.map((attachment, index) => {
              return (
                <Attachments
                  key={index}
                  url={attachment.url}
                  isRight={props.isRight}
                  fileName={attachment.fileName}
                  size={attachment.size}
                />
              );
            })}
        </Content>
      </MessageWrap>
      <MessageOptions>
        <Avatar>
          <img src={props.message.senderId.avatar.url} alt="" />
        </Avatar>
        <span>{formatHour(props.time)}</span>
        {!props.block?.isBlock && (
          <DropDown onClick={dropDownHandle}>
            <BiDotsHorizontalRounded />
            {showMenu && (
              <DropDownContent translate="translate(0px, 25px)">
                <CopyToClipboard text={props.message.content}>
                  <div>
                    <IoCopyOutline></IoCopyOutline>
                    <span>Copy</span>
                  </div>
                </CopyToClipboard>
                <div onClick={replyHandler}>
                  <IoReturnUpBack></IoReturnUpBack>
                  <span>Reply</span>
                </div>
                <div onClick={forwardHandler}>
                  <IoReturnUpForward></IoReturnUpForward>
                  <span>Forward</span>
                </div>
                <div>
                  <AiOutlineStar></AiOutlineStar>
                  <span>Favourite</span>
                </div>
                <div className="text-danger" onClick={deleteHandler}>
                  <RiDeleteBinLine></RiDeleteBinLine>
                  <span>Delete</span>
                </div>
              </DropDownContent>
            )}
          </DropDown>
        )}
      </MessageOptions>
    </Message>
  );
};

export default Messages;
