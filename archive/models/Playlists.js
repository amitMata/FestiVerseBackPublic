const mongoose = require("mongoose");

const PlaylistsScheme = new mongoose.Schema({
  link: {
    type: String,
    unique: true,
    required: [true, "Please share a link to the playlist"],
  },
  platform: {
    type: String,
    required: [true, "Please specify the playlist's playform"],
    select: false,
  },
});

const PlaylistModel = mongoose.model("Playlists", PlaylistsScheme);

module.exports = PlaylistModel;
