import React from "react";
import { searchUser } from "../../utilities/utilities";
import { DialogList } from "./DialogItems.styled";
import DialogMain from "./DialogMain";

const DialogItems = (props) => {
  return (
    <DialogList newGroup={props.newGroup} isForward={props.isForward}>
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
              newGroup={props.newGroup}
              setShowModalDialog={props.setShowModalDialog}
              setNewMembers={props.setNewMembers}
            />
          );
        })}
    </DialogList>
  );
};

export default DialogItems;
