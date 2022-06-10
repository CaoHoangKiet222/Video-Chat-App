const Meetings = require("../models/meetings");
const { pushCalls, getUserCalls } = require("../utilities/utilities");

exports.saveCalls = async (req, res, _next) => {
  try {
    const { callerId, calleeId, startCall } = req.body;
    await new Meetings({ callerId, calleeId, startCall }).save();
  } catch (error) {
    console.log(error);
  }
};

exports.getCalls = async (req, res, _next) => {
  try {
    const userIsCaller = await Meetings.find({
      callerId: req.session.user._id,
    })
      .populate([{ path: "calleeId" }])
      .select("calleeId startCall callTime callAccepted");

    const userIsCallee = await Meetings.find({
      calleeId: req.session.user._id,
    })
      .populate([{ path: "callerId" }])
      .select("callerId startCall callTime callAccepted");

    console.log("userIsCaller", userIsCaller);
    // console.log("userIsCallee", userIsCallee);
    // const array = getUserCalls("userIsCaller", userIsCaller);
    // const array2 = getUserCalls("userIsCallee", userIsCallee);
    // console.log("array", array);
    // console.log("array", array2);

    res.json({
      userIsCaller: getUserCalls("userIsCaller", userIsCaller),
      userIsCallee: getUserCalls("userIsCallee", userIsCallee),
    });
  } catch (error) {
    console.log(error);
  }
};
