const router = require("express").Router();
const {authMiddleware} = require("../middlewares/authMiddleware")

const userCtrl = require("../controller/userCtrl");


router.get("/", authMiddleware, userCtrl.getAllUser);
router.get("/:id", userCtrl.getUser);
router.put("/:id", authMiddleware, userCtrl.updateUser);
router.delete("/:id",authMiddleware, userCtrl.deleteUser);


module.exports = router;