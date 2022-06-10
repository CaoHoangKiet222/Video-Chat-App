const Meetings = require("../models/meetings");

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
    }).populate([{ path: "calleeId" }]);

    const userIsCallee = await Meetings.find({
      calleeId: req.session.user._id,
    }).populate([{ path: "callerId" }]);

    console.log("userIsCaller", userIsCaller);
    console.log("userIsCallee", userIsCallee);
    // const array = new Array();
    // for (let i = 0; i  < array.length; i ++) {
    //   for (let y = 0; y < userIsCaller.length; y++) {
    //   }
    // }

    res.json([]);
  } catch (error) {
    console.log(error);
  }
};
