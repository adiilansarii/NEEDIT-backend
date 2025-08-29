const express=require("express")
const { getBlogs,getBlogById,addBlog,deleteBlog,editBlog} = require("../controller/blogs")
const router=express.Router()
const { checkForAuthenticationCookie } = require("../middleware/authenticate");

router.post("/post", checkForAuthenticationCookie("token"), addBlog);
router.get("/",getBlogs)
router.get("/:id",getBlogById)
router.put("/:id",editBlog)
router.delete("/:id",deleteBlog)

module.exports= router