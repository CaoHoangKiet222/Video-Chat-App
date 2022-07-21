import React from "react";
import { searchToDisplay } from "../../utilities/utilities";
import { DialogList } from "./DialogItems.styled";
import DialogMain from "./DialogMain";

const DialogItems = (props) => {
  return (
    <DialogList newGroup={props.newGroup} isForward={props.isForward}>
      {props.friends
        ?.filter((friend) => {
          return searchToDisplay(friend.name, props.searchName);
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
      {props.conversation
        ?.filter(({ groupName }) => {
          if (groupName !== "") {
            return searchToDisplay(groupName, props.searchName);
          }
          return true;
        })
        .map(({ groupName, groupImg, members, _id: id }) => {
          if (groupName !== "" && groupImg.url !== "") {
            return (
              <DialogMain
                key={id}
                groupName={groupName}
                groupImg={groupImg.url}
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

          return <></>;
        })}
    </DialogList>
  );
};

export default DialogItems;
