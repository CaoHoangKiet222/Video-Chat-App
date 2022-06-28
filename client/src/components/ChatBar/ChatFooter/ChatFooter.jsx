import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { ImAttachment, ImImages } from "react-icons/im";
import {
  MdOutlineAddPhotoAlternate,
  MdOutlineEmojiEmotions,
} from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { replyActions } from "../../../store/reply-slice";
import { closeComponent } from "../../../utilities/utilities";
import EmojiPicker from "../../UI/EmojiPicker";
import { FilesContent, InputForm, ReplyForm } from "./ChatFooter.styled";
import { AiFillFileText } from "react-icons/ai";
import { BsFiles } from "react-icons/bs";
import { errorActions } from "../../../store/error-slice";
import { v4 as uuid4 } from "uuid";

const ChatFooter = (props) => {
  const inputValue = useRef("");
  const [closeRepForm, setCloseRepForm] = useState(true);
  const [clickEmoji, setClickEmoji] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const reply = useSelector((state) => state.reply.reply);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const nameRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (reply?.isClick) {
      setCloseRepForm(false);
      inputValue.current.focus();
    }
  }, [reply]);

  useEffect(() => {
    if (imagesPreview.length !== 0) {
      inputValue.current.focus();
    }
  }, [imagesPreview]);

  useEffect(() => {
    return closeComponent(clickEmoji, setClickEmoji);
  }, [clickEmoji]);

  useEffect(() => {
    if (!closeRepForm) {
      if (reply.message.senderId._id === user._id) {
        nameRef.current.innerText = "myself";
      } else {
        nameRef.current.innerText = reply.message?.senderId.name;
      }
      textRef.current.innerText = reply.message?.content;
    }
  }, [reply, props, closeRepForm, user]);

  const inputChangeHanle = (e) => {
    inputValue.current.value = e.target.value;
  };

  const submitHandle = (e) => {
    props.onSendMessage(e, reply, inputValue.current.value, {
      images: imagesPreview,
      attachments,
    });
    inputValue.current.value = "";
    closeHandler();
  };

  const closeHandler = () => {
    setCloseRepForm(true);
    setImagesPreview([]);
    setAttachments([]);
    dispatch(replyActions.setReply({ reply: null }));
  };

  const handleEmoji = (e) => {
    inputValue.current.value += e.native;
  };

  const handleMultipleFiles = (e, type) => {
    for (const file of e.target.files) {
      console.log(file);

      if (file.type === "text/x-c++src") {
        return dispatch(
          errorActions.setError({
            error: true,
            message: "Cannot upload this file!!!",
          })
        );
      }

      const fReader = new FileReader();
      fReader.readAsDataURL(file);
      fReader.onload = (event) => {
        if (type === "images-preview") {
          setImagesPreview((preImgs) => [
            ...preImgs,
            {
              url: event.target.result,
            },
          ]);
        } else if (type === "attachments") {
          setAttachments((preAttachs) => [
            ...preAttachs,
            {
              url: event.target.result,
              fileName: file.name,
              size: (file.size / 1024).toFixed(2) + "KB",
            },
          ]);
        }
      };
    }
  };

  const closeFilesHandler = (index, type) => {
    if (type === "images-preview") {
      setImagesPreview((preImgs) => {
        preImgs.splice(index, 1);
        return [...preImgs];
      });
    } else if (type === "attachments") {
      setAttachments((preAttachs) => {
        preAttachs.splice(index, 1);
        return [...preAttachs];
      });
    }
  };

  return (
    <InputForm onSubmit={submitHandle}>
      {!closeRepForm && (
        <ReplyForm>
          <div className="container">
            <div className="text-reply">
              <div className="text-reply-container">
                <div>
                  <span>
                    Replying to <b ref={nameRef}></b>
                  </span>
                </div>
                <div>
                  <span className="text-muted" ref={textRef}></span>
                </div>
              </div>
            </div>
            <div className="close-btn" onClick={closeHandler}>
              <IoClose />
            </div>
          </div>
        </ReplyForm>
      )}
      {attachments.length !== 0 && (
        <FilesContent>
          <div className="container">
            <div className="content">
              {attachments.map(({ fileName }, index) => {
                console.log(fileName);
                return (
                  <div className="attachments" key={index}>
                    <div className="content-attachment">
                      <div className="icon">
                        <AiFillFileText />
                      </div>
                      <div className="attachment">{fileName}</div>
                    </div>
                    <div
                      className="close-btn"
                      onClick={() => {
                        closeFilesHandler(index, "attachments");
                      }}
                    >
                      <IoClose />
                    </div>
                  </div>
                );
              })}
              <div className="upload-another-attach">
                <label htmlFor="uploadAnotherAttach">
                  <BsFiles />
                </label>
                <input
                  type="file"
                  id="uploadAnotherAttach"
                  accept=".xlsx,.xls,.doc, .docx, .ppt, .pptx,.txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleMultipleFiles(e, "attachments")}
                />
              </div>
            </div>
          </div>
        </FilesContent>
      )}
      {imagesPreview.length !== 0 && (
        <FilesContent>
          <div className="container">
            <div className="content">
              {imagesPreview.map(({ url }, index) => {
                return (
                  <div className="image" key={index}>
                    <img src={url} alt="" />
                    <div
                      className="close-btn"
                      onClick={() => {
                        closeFilesHandler(index, "images-preview");
                      }}
                    >
                      <IoClose />
                    </div>
                  </div>
                );
              })}
              <div className="upload-another-image">
                <label htmlFor="uploadAnotherImg">
                  <MdOutlineAddPhotoAlternate />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="uploadAnotherImg"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleMultipleFiles(e, "images-preview")}
                />
              </div>
            </div>
          </div>
        </FilesContent>
      )}
      <div className="container">
        <div
          className="input-group"
          onClick={(e) => {
            e.stopPropagation();
            setClickEmoji(true);
          }}
        >
          <div className="dropdown">
            <MdOutlineEmojiEmotions />
            {clickEmoji && <EmojiPicker onEmojiSelect={handleEmoji} />}
          </div>
        </div>
        <div className="image-attach">
          <label htmlFor="imageAttach">
            <ImImages />
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageAttach"
            style={{ display: "none" }}
            multiple
            onChange={(e) => handleMultipleFiles(e, "images-preview")}
          />
        </div>
        <div className="file-attach">
          <label htmlFor="fileAttach">
            <ImAttachment />
          </label>
          <input
            type="file"
            id="fileAttach"
            style={{ display: "none" }}
            accept=".xlsx,.xls,.doc, .docx, .ppt, .pptx,.txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            multiple
            onChange={(e) => handleMultipleFiles(e, "attachments")}
          />
        </div>
        <input
          type={props.type}
          placeholder="Enter your message..."
          ref={inputValue}
          onChange={inputChangeHanle}
          multiple
        />
        <button type="submit">
          <RiMailSendLine />
        </button>
      </div>
    </InputForm>
  );
};

export default ChatFooter;
