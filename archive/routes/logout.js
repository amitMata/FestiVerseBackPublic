const express = require("express");
const router = express.Router();
const logout = require("../controllers/logoutController");

router.route("/logout").post(logout.logout);

module.exports = router;
