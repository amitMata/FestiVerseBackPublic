const Playlist = require("../models/Playlists");
const User = require("../models/User");
const AppError = require("../middleware/AppError");

// Get all playlists
exports.getPlaylists = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.user) {
      filter.user = req.query.user;
    }

    const playlists = await Playlist.find(filter);

    const loggedInUserId = req.cookies.UserID;

    res.status(200).json({
      status: "success",
      results: playlists.length,
      data: {
        playlists,
      },
      user: loggedInUserId,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPlaylistsByUser = async (req, res, next) => {
  try {
    const userId = req.cookies.UserID;
    const playlistsByUserID = await Playlist.find({ UserID: userId });
    res.status(200).json({
      status: "success",
      data: {
        playlists: playlistsByUserID,
      },
      user: userId,
    });
  } catch (err) {
    next(err);
  }
};

exports.addPlaylist = async (req, res, next) => {
  try {
    const { name, link, platform } = req.body;

    if (!link || !platform) {
      return next(
        new AppError("Both 'link' and 'platform' are required.", 400)
      );
    }

    const userId = req.cookies.UserID;

    const user = await User.findOne({ UserId: userId });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const newPlaylist = await Playlist.create({
      name,
      link,
      platform,
      uploader: user.name,
      UserID: userId,
    });

    res.status(201).json({
      status: "success",
      data: {
        playlist: newPlaylist,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res, next) => {
  try {
    const userId = req.cookies.UserID;
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      UserID: userId,
    });

    if (!playlist) {
      return next(
        new AppError(
          "No playlist found with that ID, or you are not the owner of the playlist",
          404
        )
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
