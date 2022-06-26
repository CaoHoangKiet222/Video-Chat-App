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
import { ImgPreview, InputForm, ReplyForm } from "./ChatFooter.styled";

const ChatFooter = (props) => {
  const inputValue = useRef("");
  const [closeRepForm, setCloseRepForm] = useState(true);
  const [clickEmoji, setClickEmoji] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
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
        nameRef.current.innerText = props.member.name;
      }
      textRef.current.innerText = reply.message.content;
    }
  }, [reply, props, closeRepForm, user]);

  const inputChangeHanle = (e) => {
    inputValue.current.value = e.target.value;
  };

  const submitHandle = (e) => {
    props.onSendMessage(e, reply, inputValue.current.value, {
      images: imagesPreview,
    });
    inputValue.current.value = "";
    closeHandler();
  };

  const closeHandler = () => {
    setCloseRepForm(true);
    setImagesPreview([]);
    dispatch(replyActions.setReply({ reply: null }));
  };

  const handleEmoji = (e) => {
    inputValue.current.value += e.native;
  };

  const hadleMultipleImgages = (e) => {
    for (const file of e.target.files) {
      const fReader = new FileReader();
      fReader.readAsDataURL(file);
      fReader.onload = (event) => {
        setImagesPreview((preImgs) => [...preImgs, event.target.result]);
      };
    }
  };

  const closeImageHandler = (index) => {
    setImagesPreview((preImgs) => {
      preImgs.splice(index, 1);
      return [...preImgs];
    });
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
      {imagesPreview.length !== 0 && (
        <ImgPreview>
          <div className="container">
            <div className="content-image">
              {imagesPreview.map((data, index) => {
                return (
                  <div className="image" key={index}>
                    <img src={data} alt="" />
                    <div
                      className="close-btn"
                      onClick={() => {
                        closeImageHandler(index);
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
                  onChange={hadleMultipleImgages}
                />
              </div>
            </div>
          </div>
        </ImgPreview>
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
            onChange={hadleMultipleImgages}
          />
        </div>
        <div className="file-attach">
          <label htmlFor="fileAttach">
            <ImAttachment />
          </label>
          <input type="file" id="fileAttach" style={{ display: "none" }} />
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
