const express = require("express");
const router = express.Router();
const playlistsController = require("../controllers/playlistsController");
const authController = require("../controllers/authController");

router.delete(
  "/playlists/:id",
  authController.protect,
  playlistsController.deletePlaylist
);

router.get(
  "/playlists/user",
  authController.protect,
  playlistsController.getPlaylistsByUser
);

router
  .route("/playlists")
  .get(authController.protect, playlistsController.getPlaylists)
  .post(playlistsController.addPlaylist);

module.exports = router;
