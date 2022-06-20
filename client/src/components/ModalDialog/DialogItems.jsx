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
              isGroup={false}
              isForward={props.isForward}
              newGroup={props.newGroup}
              setShowModalDialog={props.setShowModalDialog}
              setNewMembers={props.setNewMembers}
            />
          );
        })}
      {props.conversation?.map(({ groupName, groupImg, members, _id: id }) => {
        if (groupName !== "" && groupImg !== "") {
          return (
            <DialogMain
              key={id}
              groupName={groupName}
              groupImg={groupImg}
              isGroup={true}
              room={id}
              numsPeople={members.length}
              isForward={props.isForward}
              newGroup={props.newGroup}
              setShowModalDialog={props.setShowModalDialog}
              setNewMembers={props.setNewMembers}
            />
          );
        }
      })}
    </DialogList>
  );
};

export default DialogItems;
