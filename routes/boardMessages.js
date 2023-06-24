const express = require("express");
// const authController = require("../controllers/authController");

const router = express.Router();
const {
  getBoardMessages,
  createBoardMessage,
  updateBoardMessage,
  deleteBoardMessage,
} = require("../controllers/boardMessagesController");

router
  .route("/board-messages/:groupName")
  .get(getBoardMessages)
  .post(createBoardMessage);

router.route("/board-messages/:id").delete(deleteBoardMessage);

module.exports = router;
