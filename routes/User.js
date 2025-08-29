const express=require("express")
const { addUser, loginUser, logoutUser } = require("../controller/user")
const User = require("../model/user")
const router=express.Router()

router.post("/signup",addUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)

module.exports= router