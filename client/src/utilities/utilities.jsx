export const postData = async (url, method, data = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return response.json();
};

export const formatHour = (date) => {
  date = new Date(date);
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  if (parseInt(h.slice(-2)) >= 13) {
    return `${h.slice(-2)}:${m.slice(-2)} PM`;
  }
  return `${h.slice(-2)}:${m.slice(-2)} AM`;
};

export const formatDate = (date, seperator) => {
  date = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  switch (seperator) {
    case "/":
      return day + "/" + month + "/" + year;
    default:
      return day + " " + monthNames[month] + " " + year;
  }
};

export const formatCallTime = (date) => {
  date = new Date(date);
  const dateNow = new Date(Date.now());
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const hNow = dateNow.getHours();
  const mNow = dateNow.getMinutes();
  const sNow = dateNow.getSeconds();

  return Math.abs(hNow - h) === 0
    ? Math.abs(mNow - m) + "m " + Math.abs(sNow - s) + "s"
    : Math.abs(hNow - h) +
        "h " +
        Math.abs(mNow - m) +
        "m " +
        Math.abs(sNow - s) +
        "s";
};

export const checkSameHour = (predate, date) => {
  date = new Date(date);
  predate = new Date(predate);
  if (formatHour(date) === formatHour(predate)) {
    return true;
  }
  return false;
};

export const checkSameDate = (predate, date) => {
  date = new Date(date);
  predate = new Date(predate);
  if (formatDate(date) === formatDate(predate)) {
    return true;
  }
  return false;
};

export const getFloatTime = (date) => {
  const h = new Date(date).getHours();
  const m = new Date(date).getMinutes();
  const hNow = new Date(Date.now()).getHours();
  const mNow = new Date(Date.now()).getMinutes();

  return Math.abs(hNow - h) === 0
    ? Math.abs(mNow - m) === 0
      ? { startCall: "Just now" }
      : Math.abs(mNow - m) === 1
      ? { startCall: "1 min ago" }
      : { startCall: Math.abs(mNow - m) + " mins ago" }
    : Math.abs(hNow - h) === 1
    ? { startCall: "1 hour ago" }
    : {
        startCall: Math.abs(hNow - h) + " hours ago",
      };
};

export const getPhoneTime = (call, type = "") => {
  if (checkSameDate(call.startCall, Date.now())) {
    return getFloatTime(call.startCall);
  } else if (
    new Date(call.startCall).getUTCDate() ===
    new Date(Date.now()).getUTCDate() - 1
  ) {
    return type === "Calls"
      ? { startCall: "Yesterday at " + formatHour(call.startCall) }
      : { startCall: "Yesterday" };
  }

  return type === "Calls"
    ? {
        startCall:
          formatDate(call.startCall, "/") + " at " + formatHour(call.startCall),
      }
    : { startCall: formatDate(call.startCall, "/") };
};

const comparePhoneTimeIsDone = (x, y, array, i, j) => {
  if (x === y) {
    return false;
  } else if (x < y) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return true;
};

export const arrangePhoneTime = (array) => {
  const copyArray = [...array];
  for (let i = 0; i < copyArray.length; i++) {
    for (let j = i + 1; j < copyArray.length; j++) {
      const x = new Date(copyArray[i].startCall);
      const y = new Date(copyArray[j].startCall);
      if (
        !comparePhoneTimeIsDone(
          x.getUTCFullYear(),
          y.getUTCFullYear(),
          copyArray,
          i,
          j
        )
      ) {
        if (
          !comparePhoneTimeIsDone(
            x.getUTCMonth(),
            y.getUTCMonth(),
            copyArray,
            i,
            j
          )
        ) {
          if (
            !comparePhoneTimeIsDone(
              x.getUTCDate(),
              y.getUTCDate(),
              copyArray,
              i,
              j
            )
          ) {
            if (
              !comparePhoneTimeIsDone(
                x.getHours(),
                y.getHours(),
                copyArray,
                i,
                j
              )
            ) {
              if (
                !comparePhoneTimeIsDone(
                  x.getMinutes(),
                  y.getMinutes(),
                  copyArray,
                  i,
                  j
                )
              ) {
                if (
                  !comparePhoneTimeIsDone(
                    x.getSeconds(),
                    y.getSeconds(),
                    copyArray,
                    i,
                    j
                  )
                ) {
                  continue;
                }
              }
            }
          }
        }
      }
    }
  }
  return copyArray;
};

export const searchToDisplay = (name, searchName) => {
  if (
    searchName === "" ||
    name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1
  ) {
    return true;
  }
  return false;
};

export const checkIsFriend = (user, friend, conversation) => {
  for (const [, conv] of conversation.entries()) {
    const member = conv.members.find((mem) => {
      return user._id !== mem.userId._id;
    });

    if (member.userId._id === friend._id && conv.members.length < 3) {
      return true;
    }
  }
  return false;
};

export const getUserMedia = async (type) => {
  return await navigator.mediaDevices.getUserMedia(type);
};

export const shareScreen = (stream, peer) => {
  navigator.mediaDevices
    .getDisplayMedia({ cursor: true })
    .then((shareStream) => {
      const screenTrack = shareStream.getTracks()[0];

      const videoTrack = stream
        .getTracks()
        .find((track) => track.kind === "video");

      peer.replaceTrack(videoTrack, screenTrack, stream);

      screenTrack.onended = () => {
        peer.replaceTrack(screenTrack, videoTrack, stream);
      };
    })
    .catch((error) => {
      console.log(error);
    });
};

export const shareGroupScreen = (
  stream,
  peers,
  setIsShare,
  shareStreamRef,
  socket,
  room
) => {
  navigator.mediaDevices
    .getDisplayMedia({ cursor: true })
    .then((shareStream) => {
      shareStreamRef.current = shareStream;

      replacePeersTrack(shareStream, stream, peers, setIsShare, socket, room);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const replacePeersTrack = (
  shareStream,
  stream,
  peers,
  setIsShare,
  socket,
  room
) => {
  const screenTrack = shareStream.getTracks()[0];

  const videoTrack = stream.getTracks().find((track) => track.kind === "video");

  peers.forEach(({ peer }) => {
    peer.replaceTrack(videoTrack, screenTrack, stream);
  });

  screenTrack.onended = () => {
    setIsShare(false);
    socket.emit("toggleControls", { room });

    peers.forEach(({ peer }) => {
      peer.replaceTrack(screenTrack, videoTrack, stream);
    });
  };
};

export const getConversationId = (conversation, member, user) => {
  const existConv = conversation?.find(({ members }) => {
    const memberIdIndex = members?.findIndex(
      (mem) => mem?.userId?._id === member?._id
    );
    const userIdIndex = members?.findIndex(
      (mem) => mem?.userId?._id === user?._id
    );
    return memberIdIndex !== -1 && userIdIndex !== -1;
  });
  return existConv?._id;
};

export const closeComponent = (showSomething, setShowSomething) => {
  const checkClickOutSide = () => {
    if (showSomething) {
      setShowSomething(false);
    }
  };
  document.addEventListener("click", checkClickOutSide);
  return () => {
    document.removeEventListener("click", checkClickOutSide);
  };
};

export const getMembersInGroupOnline = (members) => {
  const onlineMems = [];
  for (const member of members) {
    if (member.userId.isLoggined) {
      onlineMems.push(member);
    }
  }
  return onlineMems;
};

export const findImgAndNameGroup = (conversation, room) => {
  const { groupImg, groupName } = conversation.find(({ _id }) => _id === room);
  return { groupImg, groupName };
};

export const toggleAttributePeers = (peers, userId, attribute) => {
  const peer = peers.find((peer) => peer.peerId === userId);
  peer[attribute] = !peer[attribute];
  return peers;
};

export const splicePeers = (peers, id) => {
  const index = peers.findIndex(({ peerId }) => peerId === id);
  index !== -1 && peers.splice(index, 1);
  return peers;
};

export const convertString = (oldString) => {
  let arrStr = oldString.trim().split("\n");

  return arrStr
    .map((str) => str.trim())
    .filter((str) => str.length > 0)
    .map((str) =>
      str
        .split(" ")
        .filter((x) => x.length > 0)
        .join(" ")
    )
    .join("\n");
};
