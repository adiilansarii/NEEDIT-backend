const mongoose = require("mongoose");

// Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String }, // blog content
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to author
  },
  { timestamps: true } // automatically add createdAt & updatedAt
);

module.exports = mongoose.model("AddBlog", blogSchema);
