import React from "react";
import { Img, Name, PeerInfo, RemotePeer, Status } from "./CommonPeer.styled";

const CommonPeer = (props) => {
  return (
    <PeerInfo className="main-peer" type={props.type}>
      <RemotePeer>
        <Name font-size={props["font-size"]} padding={props.padding}>
          Cao Hoang Kiet
        </Name>
        <Img height={props.height} width={props.width}>
          <img src="http://localhost:3000/images/user.jpg" alt="" />
        </Img>
        <Status font-size={props["font-size"]} padding={props.padding}>
          spectator
        </Status>
      </RemotePeer>
    </PeerInfo>
  );
};

export default CommonPeer;
