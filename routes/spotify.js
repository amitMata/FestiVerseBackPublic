const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get("/spotify/search/:name/:token", spotifyController.searchArtist);
router.get("/spotify/artist/:id/:token", spotifyController.getArtistData);
router.get("/spotify", spotifyController.getToken);

module.exports = router;
