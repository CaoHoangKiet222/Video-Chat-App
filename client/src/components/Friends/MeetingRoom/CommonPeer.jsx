import React from "react";
import { Img, Name, PeerInfo, RemotePeer, Status } from "./CommonPeer.styled";

const CommonPeer = (props) => {
  const ENDPOINT_CLIENT = process.env.REACT_APP_ENDPOINT_CLIENT;
  return (
    <PeerInfo className={props.className} type={props.type}>
      <RemotePeer>
        <Name font-size={props["font-size"]} padding={props.padding}>
          {props.user?.name}
        </Name>
        <Img height={props.height} width={props.width}>
          <img src={`${ENDPOINT_CLIENT}/${props.user?.avata}`} alt="" />
        </Img>
        <Status font-size={props["font-size"]} padding={props.padding}>
          spectator
        </Status>
      </RemotePeer>
    </PeerInfo>
  );
};

export default CommonPeer;
