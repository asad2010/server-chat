const router = require("express").Router();
const {authMiddleware} = require("../middlewares/authMiddleware")
const chatCtrl = require("../controller/chatCtrll");

router.get("/", authMiddleware, chatCtrl.userChats)
router.get("/:firstId/:secondId", authMiddleware, chatCtrl.findChat)
router.delete("/:chatId", authMiddleware, chatCtrl.deleteChat)

module.exports = router

