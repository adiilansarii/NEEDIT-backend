const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { checkForAuthenticationCookie } = require("./middleware/authenticate");
const routerBlogs = require("./routes/Blogs");
const routerUser = require("./routes/User");

const app = express();
const PORT = process.env.PORT || 3010;

// ----------------- MIDDLEWARE -----------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// ----------------- CORS SETUP -----------------
// Allow localhost/frontend for testing with credentials
app.use(
  cors({
    origin: "https://needit-interview.vercel.app", // your frontend
    credentials: true, // allow cookies
  })
);

// ----------------- DATABASE -----------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------- AUTH MIDDLEWARE -----------------
// Skip login/signup routes
app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") return next();
  checkForAuthenticationCookie("token")(req, res, next);
});

// ----------------- ROUTES -----------------

app.use("/", routerUser);
app.use("/blogs", routerBlogs);

// Root route to return logged-in user info
app.get("/", checkForAuthenticationCookie("token"), (req, res) => {
  res.json({ user: req.user });
});

// ----------------- FRONTEND SERVE -----------------
// Serve React build (client/dist folder after build)
const distPath = path.join(__dirname, "client", "dist");
app.use(express.static(distPath));

// Catch-all route for React Router (fixes 404 on refresh)
app.get("/*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ----------------- ERROR HANDLER -----------------

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ----------------- START SERVER -----------------

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
