const express = require("express");
const router = express.Router();

const { addUser, loginUser, logoutUser } = require("../controller/User");

router.post("/signup", addUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
