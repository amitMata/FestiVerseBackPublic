const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");
const authController = require("../controllers/authController");

router.get(
  "/groups/:groupName",
  authController.protect,
  groupsController.getGroup
);

router.post(
  "/groups/create",
  authController.protect,
  groupsController.createGroup
);
router.post("/groups/join", authController.protect, groupsController.joinGroup);
router.post(
  "/groups/leave",
  authController.protect,
  groupsController.leaveGroup
);
router.get("/groups", authController.protect, groupsController.getAllTheGroups);

router.get(
  "/group/:groupName",
  authController.protect,
  groupsController.getGroup
);

module.exports = router;
