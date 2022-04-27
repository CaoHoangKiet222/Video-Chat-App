import React, {useRef} from "react";
import {RiMailSendLine} from 'react-icons/ri';
import {InputForm} from "./ChatFooter.styled";

const ChatFooter = (props) => {
   const inputValue = useRef('');

   const inputChangeHanle = (e) => {
      inputValue.current.value = e.target.value;
      props.onSetMessage(e.target.value);
   }

   const submitHandle = (e) => {
      props.onSetMessage(inputValue.current.value);
      props.onSendMessage(e);
      inputValue.current.value = '';
   }

   return <InputForm onSubmit={submitHandle}>
      <input type={props.type}
         placeholder="Enter your message..."
         value={props.message}
         ref={inputValue}
         onChange={inputChangeHanle}
      />
      <button type="submit"><RiMailSendLine /></button>
   </InputForm>;
}

export default ChatFooter;
