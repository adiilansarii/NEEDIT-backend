const AddBlog = require("../model/AddBlog");

async function getBlogs(req, res) {
  try {
    const blogs = await AddBlog.find().populate(
      "user",
      "fullName branch profileImage"
    );
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mess: "Server error" });
  }
}
async function getBlogById(req, res) {
  const blog = await AddBlog.findById(req.params.id).populate(
    "user",
    "fullName branch profileImage"
  );
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  return res.json(blog);
}

async function addBlog(req, res) {
  const { title, company, category, content } = req.body;
  const userId = req.user?._id; // make sure authenticate middleware sets req.user

  if (!title || !company || !category || !content)
    return res.status(400).json({ message: "All fields are required" });

  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  try {
    const newBlog = await AddBlog.create({
      title,
      company,
      category,
      content,
      user: userId, // associate blog with logged-in user
    });
    return res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}


async function editBlog(req, res) {
  const { title, company, category, content } = req.body;
  const blog = await AddBlog.findById(req.params.id);
  try {
    if (blog) {
      await AddBlog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ title, company, category, content });
    }
  } catch (error) {
    return res.status(404).json({ mess: "can not find recipe" });
  }
}
async function deleteBlog(req, res) {
  try {
    const Blog = await AddBlog.findByIdAndDelete(req.params.id);

    if (!Blog) {
      return res.status(404).json({ mess: "Blog not found" });
    }

    return res.status(200).json({ mess: "Blog deleted successfully", Blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mess: "Server error" });
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  addBlog,
  editBlog,
  deleteBlog,
};
