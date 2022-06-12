import React from "react";
import {
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
} from "react-icons/bs";
import { RiPhoneLine } from "react-icons/ri";
import { ListItem } from "../Friends/Friends.styled";
import { Media } from "./CallItem.styled";
import { getPhoneTime } from "../../utilities/utilities";

const CallItem = ({ call }) => {
  return (
    <ListItem type="Calls">
      <Media>
        <div className="avatar">
          <span>
            {call.isReceived ? (
              <BsFillTelephoneInboundFill />
            ) : (
              <BsFillTelephoneOutboundFill />
            )}
          </span>
        </div>
        <div className="media-body">
          <h6 style={{ color: `${!call.callAccepted && "#FF337C"}` }}>
            {!call.callAccepted
              ? "Miss Call"
              : call.isReceived
              ? "Incoming Call"
              : "Outgoing Call"}
          </h6>
          <div>
            <p>{getPhoneTime(call, "Calls").startCall}</p>
            {call.callAccepted && (
              <>
                <span>•</span>
                <p>{call.callTime}</p>
              </>
            )}
          </div>
        </div>
        <div className="media-options">
          <button>
            <RiPhoneLine />
          </button>
        </div>
      </Media>
    </ListItem>
  );
};

export default CallItem;
