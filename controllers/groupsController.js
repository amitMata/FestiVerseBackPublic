const Groups = require("../models/Groups");
const User = require("../models/User");
const AppError = require("../middleware/AppError");

exports.createGroup = async (req, res, next) => {
  try {
    let nameOfUser = "";
    const userId = req.cookies.UserID;
    const retreiveUserByUserId = await User.findOne({ UserId: userId });
    nameOfUser = retreiveUserByUserId.name;
    const groupName = req.body.GroupName;

    if (!groupName) {
      return next(new AppError("Group name is required.", 400));
    }
    if (!nameOfUser) {
      return next(new AppError("Could not retrieve user's name.", 400));
    }

    const existingGroup = await Groups.findOne({
      groupName: new RegExp("^" + groupName + "$", "i"),
    });
    if (existingGroup) {
      return next(new AppError("A group with this name already exists.", 400));
    }

    const newGroup = await Groups.create({
      groupName,
    });

    res.status(201).json({
      status: "success",
      data: {
        group: newGroup,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.joinGroup = async (req, res, next) => {
  const { groupName } = req.body;
  const userId = req.cookies.UserID;

  if (!groupName) {
    return next(new AppError("Group name was not sent correctly.", 400));
  }

  if (!userId) {
    return next(new AppError("User ID was not sent correctly.", 400));
  }

  try {
    const user = await User.findOne({ UserId: userId });
    if (user && user.groupNameOfUser !== "") {
      return next(
        new AppError("User is already a participant in a group.", 400)
      );
    }

    const group = await Groups.findOne({ groupName });

    if (!group) {
      return next(new AppError("Group not found.", 404));
    }

    group.participants.push(userId);

    user.groupNameOfUser = groupName;

    await user.save();

    const updatedGroup = await group.save();

    res.status(200).json({
      status: "success",
      data: {
        group: updatedGroup,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.leaveGroup = async (req, res, next) => {
  const { groupName } = req.body;
  const userId = req.cookies.UserID;
  if (!groupName) {
    return next(new AppError("Group name was not sent correctly.", 400));
  }

  if (!userId) {
    return next(new AppError("User ID was not sent correctly.", 400));
  }

  try {
    const group = await Groups.findOne({ groupName });
    if (!group) {
      return next(new AppError("Group not found.", 404));
    }

    const userIndex = group.participants.indexOf(userId);
    if (userIndex === -1) {
      return next(new AppError("User is not a participant in the group.", 400));
    }

    group.participants.splice(userIndex, 1);

    const user = await User.findOne({ UserId: userId });
    user.groupNameOfUser = "";

    await user.save();

    const updatedGroup = await group.save();

    res.status(200).json({
      status: "success",
      data: {
        group: updatedGroup,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllTheGroups = async (req, res, next) => {
  try {
    const groups = await Groups.find({});

    res.status(200).json({
      status: "success",
      results: groups.length,
      data: {
        groups,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const { groupName } = req.params;
    const userId = req.cookies.UserID;

    const group = await Groups.findOne({ groupName });

    if (!group) {
      return next(new AppError("Group not found.", 404));
    }

    const isParticipant = group.participants.includes(userId);
    if (!isParticipant) {
      return next(
        new AppError("You are not a participant in this group.", 403)
      );
    }

    const participants = await Promise.all(
      group.participants.map(async (participantId) => {
        const user = await User.findOne({ UserId: participantId });
        return user ? user.name : null;
      })
    );

    group.participants = participants;

    res.status(200).json({
      status: "success",
      data: {
        group,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
