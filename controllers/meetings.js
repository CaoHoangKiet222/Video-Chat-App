const Meetings = require("../models/meetings");
const { getUserCalls } = require("../utilities/utilities");

exports.getCalls = async (req, res, _next) => {
  try {
    const userIsCaller = await Meetings.find({
      callerId: req.session.user._id,
    })
      .populate([
        {
          path: "calleeId",
          select: "-password -avatar.public_id -twoFA.secret",
        },
      ])
      .select("calleeId startCall callTime callAccepted");

    const userIsCallee = await Meetings.find({
      calleeId: req.session.user._id,
    })
      .populate([
        {
          path: "callerId",
          select: "-password -avatar.public_id -twoFA.secret",
        },
      ])
      .select("callerId startCall callTime callAccepted");

    res.json({
      calls: getUserCalls(
        "userIsCallee",
        userIsCallee,
        getUserCalls("userIsCaller", userIsCaller)
      ),
    });
  } catch (error) {
    console.log(error);
  }
};
