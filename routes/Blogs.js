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

// Edit a blog by ID (requires authentication)
router.put("/:id", checkForAuthenticationCookie("token"), editBlog);

// Delete a blog by ID (requires authentication)
router.delete("/:id", checkForAuthenticationCookie("token"), deleteBlog);

module.exports = router;
