exports.sortName = (array) => {
  return array.sort((obj1, obj2) => {
    if (obj1.name > obj2.name) return 1;
    if (obj1.name < obj2.name) return -1;
    return 0;
  });
};

const pushCalls = (type = "", array = [], object = {}) => {
  switch (type) {
    case "userIsCaller":
      return array.push({
        callee: object.calleeId,
        calls: [
          {
            _id: object._id,
            startCall: object.startCall,
            callTime: object.callTime,
            callAccepted: object.callAccepted,
          },
        ],
      });
    default: // "userIsCallee"
      return array.push({
        caller: object.callerId,
        calls: [
          {
            _id: object._id,
            startCall: object.startCall,
            callTime: object.callTime,
            callAccepted: object.callAccepted,
          },
        ],
      });
  }
};

exports.getUserCalls = (type = "", userCall = [], array = []) => {
  for (let i = 0; i < userCall.length; i++) {
    if (i === 0) {
      pushCalls(type, array, userCall[0]);
    } else {
      const preLength = array.length;
      let found = false;
      for (let j = 0; j < preLength && !found; j++) {
        let compare;
        switch (type) {
          case "userIsCaller":
            compare =
              array[j].callee._id.toString() ===
              userCall[i].calleeId._id.toString();
            break;
          default: // "userIsCallee"
            compare =
              array[j].caller._id.toString() ===
              userCall[i].callerId._id.toString();
            break;
        }
        if (compare) {
          array[j].calls.push({
            _id: userCall[i]._id,
            startCall: userCall[i].startCall,
            callTime: userCall[i].callTime,
            callAccepted: userCall[i].callAccepted,
          });
          found = true;
        }
      }
      if (!found) {
        pushCalls(type, array, userCall[i]);
      }
    }
  }
  return array;
};
