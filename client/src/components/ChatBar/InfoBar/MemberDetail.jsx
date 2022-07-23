import React from "react";
import { BiBlock } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { blockConversation } from "../../../store/conversations-creator";

const MemberDetail = ({ member, isAdmin, block, room, isUserAdmin }) => {
  const dispatch = useDispatch();

  const blockSpecificMem = () => {
    dispatch(
      blockConversation(
        room,
        { memberId: member._id, isAdmin: isUserAdmin, isBlock: block?.isBlock },
        "group-single"
      )
    );
  };

  return (
    <div className="card-body">
      <div className="group-content">
        <div>
          <div className="avatar">
            <img src={member.avatar.url} alt="" />
          </div>
          <div className="member-name">
            <h5>{member.name}</h5>
            {isAdmin && <span>Admin</span>}
          </div>
        </div>
        {!isAdmin && (
          <div className="block-member" onClick={blockSpecificMem}>
            {!block.isBlock ? <BiBlock /> : <CgUnblock />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
