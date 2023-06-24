const Message = require("../models/Message");

exports.getBoardMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ groupName: req.params.groupName });
    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.createBoardMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.updateBoardMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.deleteBoardMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
