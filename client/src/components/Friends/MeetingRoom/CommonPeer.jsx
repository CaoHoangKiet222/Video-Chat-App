import React from "react";
import { Img, Name, PeerInfo, RemotePeer, Status } from "./CommonPeer.styled";

const CommonPeer = (props) => {
  const avatar = props.avatar || props.user?.avatar;

  return (
    <PeerInfo className={props.className} type={props.type}>
      <RemotePeer>
        <Name font-size={props["font-size"]} padding={props.padding}>
          {props.user?.name || props.name}
        </Name>
        <Img height={props.height} width={props.width}>
          <img src={`${avatar.url}`} alt="" />
        </Img>
        <Status font-size={props["font-size"]} padding={props.padding}>
          {props.displayText}
        </Status>
      </RemotePeer>
    </PeerInfo>
  );
};

export default CommonPeer;
