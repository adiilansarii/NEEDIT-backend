const express = require("express");
const { addUser, loginUser, logoutUser } = require("../controller/user");

const router = express.Router();

// Signup route
router.post("/signup", addUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.get("/logout", logoutUser);

module.exports = router;
