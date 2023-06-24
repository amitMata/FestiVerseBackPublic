const express = require("express");
const router = express.Router();
const playlistsController = require("../controllers/playlistsController");
const authController = require("../controllers/authController");

router
  .route("/playlists")
  .get(authController.protect, playlistsController.getPlaylists)
  .post(playlistsController.addPlaylist);

module.exports = router;
