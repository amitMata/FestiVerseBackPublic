const Playlist = require("../models/Playlists");
const AppError = require("../middleware/AppError");

// Get all playlists
exports.getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({});

    res.status(200).json({
      status: "success",
      results: playlists.length,
      data: {
        playlists,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add a playlist
exports.addPlaylist = async (req, res, next) => {
  try {
    // Check if link and platform are included in the request

    const { link } = req.body;
    const { platform } = req.body;

    if (!link || !platform) {
      return next(
        new AppError("Both 'link' and 'platform' are required.", 400)
      );
    }

    const newPlaylist = await Playlist.create({
      link: req.body.link,
      platform: req.body.platform,
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
