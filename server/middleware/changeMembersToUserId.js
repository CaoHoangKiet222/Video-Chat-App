exports.changeMembersToUserId = (req, _res, next) => {
  req.body.newMembers = JSON.parse(req.body.newMembers);

  const newMemberIds = [];
  req.body.newMembers.forEach((member) => {
    newMemberIds.push({ userId: member._id });
  });
  req.body.newMembers = [...newMemberIds];

  next();
};
