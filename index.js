const express = require("express")
const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authenticate");
const mongoose =require('mongoose');
const cors=require("cors")

const routerBlogs = require("./routes/Blogs")
const routerUSer = require("./routes/User")

const app=express();
const dotenv=require("dotenv").config()
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

const PORT=process.env.PORT ||3010

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: "https://needit-frontend.vercel.app", // your frontend URL
  credentials: true // allow cookies
}));
app.use(express.static("public"));

app.use(cookieParser());//using cookieparser middleware to parse cookie
app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }
  checkForAuthenticationCookie("token")(req, res, next);
});

app.use("/",routerUSer)
app.use("/blogs",routerBlogs)

app.get("/", checkForAuthenticationCookie("token"), (req, res) => {
  res.json({ user: req.user }); // req.user is from your auth middleware
});


app.listen(PORT,()=>console.log(`sever is running of ${PORT}`))