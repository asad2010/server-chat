const router = require("express").Router();

const messageCtrl = require("../controller/messageCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/:chatId", authMiddleware, messageCtrl.getMessages);
router.post("/", authMiddleware, messageCtrl.addMessage);
router.delete("/:messageId", authMiddleware, messageCtrl.deleteMessage);



module.exports = router;