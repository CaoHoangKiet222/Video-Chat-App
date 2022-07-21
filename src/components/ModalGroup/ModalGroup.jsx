import React from "react";
import ReactDOM from "react-dom";
import ModalDialog from "../ModalDialog/ModalDialog";

const ModalGroup = (props) => {
  return ReactDOM.createPortal(
    <ModalDialog
      newGroup={true}
      setShowModalDialog={props.setShowModalGroup}
      friends={props.friends}
    />,
    document.getElementById("create-group")
  );
};

export default ModalGroup;
