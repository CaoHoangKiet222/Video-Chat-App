exports.changeMembersToUserId = (req, _res, next) => {
  const newMemberIds = [];
  req.body.newMembers.forEach((member) => {
    newMemberIds.push({ userId: member._id });
  });
  req.body.newMembers = [...newMemberIds];
  next();
};
