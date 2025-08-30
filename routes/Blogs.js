const express = require("express");
const {
  getBlogs,
  getBlogById,
  addBlog,
  deleteBlog,
  editBlog,
} = require("../controller/blogs");
const { checkForAuthenticationCookie } = require("../middleware/authenticate");

const router = express.Router();

// Add a new blog (requires authentication)
router.post("/post", checkForAuthenticationCookie("token"), addBlog);

// Get all blogs
router.get("/", getBlogs);

// Get a single blog by ID
router.get("/:id", getBlogById);

// Edit a blog by ID
router.put("/:id", editBlog);

// Delete a blog by ID
router.delete("/:id", deleteBlog);

module.exports = router;
