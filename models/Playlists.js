const mongoose = require("mongoose");

const PlaylistsScheme = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please share the name of the playlist"],
  },
  link: {
    type: String,
    unique: true,
    required: [true, "Please share a link to the playlist"],
  },
  platform: {
    type: String,
    required: [true, "Please specify the playlist's platform"],
  },
  uploader: {
    type: String,
    required: false,
  },
  UserID: {
    type: String,
    required: true,
  },
});

const PlaylistModel = mongoose.model("Playlists", PlaylistsScheme);

module.exports = PlaylistModel;
