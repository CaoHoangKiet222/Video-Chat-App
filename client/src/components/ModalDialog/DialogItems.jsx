import React from "react";
import { searchUser } from "../../utilities/utilities";
import { DialogList } from "./DialogItems.styled";
import DialogMain from "./DialogMain";

const DialogItems = (props) => {
  return (
    <DialogList isForward={props.isForward}>
      {/* <BouncyLoading /> */}
      {props.friends
        ?.filter((friend) => {
          return searchUser(friend, props.searchName);
        })
        .map((friend) => {
          return (
            <DialogMain
              key={friend._id}
              friend={friend}
              isForward={props.isForward}
              setShowModalDialog={props.setShowModalDialog}
            />
          );
        })}
    </DialogList>
  );
};

export default DialogItems;
