import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiMailSendLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { replyActions } from "../../../store/reply-slice";
import { InputForm, ReplyForm } from "./ChatFooter.styled";

const ChatFooter = (props) => {
  const inputValue = useRef("");
  const [closeRepForm, setCloseRepForm] = useState(true);
  const reply = useSelector((state) => state.reply.reply);
  const dispatch = useDispatch();
  const nameRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (reply?.isClick) {
      setCloseRepForm(false);
    }
  }, [reply]);

  useEffect(() => {
    if (!closeRepForm) {
      if (reply?.isUser) {
        nameRef.current.innerText = "myself";
      } else {
        nameRef.current.innerText = props.member.name;
      }
      textRef.current.innerText = reply.message.content;
    }
  }, [reply, props, reply?.isUser, closeRepForm]);

  const inputChangeHanle = (e) => {
    inputValue.current.value = e.target.value;
    props.onSetMessage(e.target.value);
  };

  const submitHandle = (e) => {
    props.onSetMessage(inputValue.current.value);
    props.onSendMessage(e, reply);
    inputValue.current.value = "";
    closeHandler();
  };

  const closeHandler = () => {
    setCloseRepForm(true);
    dispatch(replyActions.setReply({ reply: null }));
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
      <div className="container">
        <input
          type={props.type}
          placeholder="Enter your message..."
          value={props.message}
          ref={inputValue}
          onChange={inputChangeHanle}
        />
        <button type="submit">
          <RiMailSendLine />
        </button>
      </div>
    </InputForm>
  );
};

export default ChatFooter;
