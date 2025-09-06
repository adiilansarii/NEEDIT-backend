const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { checkForAuthenticationCookie } = require("./middleware/authenticate");
const routerBlogs = require("./routes/Blogs");
const routerUser = require("./routes/User");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Allow frontend for testing with credentials
app.use(
  cors({
    origin: "https://needit-interview.vercel.app", // your frontend link
    credentials: true, // allow cookies
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to skip auth for login/signup routes
app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") return next();
  checkForAuthenticationCookie("token")(req, res, next);
});

app.use("/", routerUser);
app.use("/blogs", routerBlogs);

// Root route to return logged-in user info
app.get("/", checkForAuthenticationCookie("token"), (req, res) => {
  res.json({ user: req.user });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
