const AddBlog = require("../model/AddBlog");

// Get all blogs
async function getBlogs(req, res) {
  try {
    const blogs = await AddBlog.find().populate(
      "user",
      "fullName branch profileImage"
    );
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get a single blog by ID
async function getBlogById(req, res) {
  try {
    const blog = await AddBlog.findById(req.params.id).populate(
      "user",
      "fullName branch profileImage"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Add a new blog
async function addBlog(req, res) {
  const { title, company, category, content } = req.body;
  const userId = req.user?._id; // from authentication middleware

  if (!title || !company || !category || !content)
    return res.status(400).json({ message: "All fields are required" });

  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  try {
    const newBlog = await AddBlog.create({
      title,
      company,
      category,
      content,
      user: userId,
    });
    return res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Edit a blog
async function editBlog(req, res) {
  try {
    const blog = await AddBlog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const updatedBlog = await AddBlog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete a blog
async function deleteBlog(req, res) {
  try {
    const blog = await AddBlog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  addBlog,
  editBlog,
  deleteBlog,
};
