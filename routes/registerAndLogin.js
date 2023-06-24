const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/validate", authController.protect, authController.validate);
router.post("/register", authController.signup);
router.post("/login", authController.login);
router.get("/getUserData", authController.protect, authController.getUserData);

module.exports = router;
