import React from "react";
import ReactDOM from "react-dom";
import ModalDialog from "../ModalDialog/ModalDialog";

const ModalInvitation = (props) => {
  return ReactDOM.createPortal(
    <ModalDialog
      invitation={true}
      setShowModalDialog={props.setShowModalInvitation}
    />,
    document.getElementById("invite-others")
  );
};

export default ModalInvitation;
