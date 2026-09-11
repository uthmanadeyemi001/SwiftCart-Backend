const express = require('express');
const { Signup, Login, getUserProfile } = require("../Controller/User.controller");
const userrouter = express.Router();
const authMiddleWare = require("../middleware/auth.middleware");

userrouter.post("/register", Signup);
userrouter.post("/login", Login);

// This route is protected using your middleware
userrouter.get("/dashboard", authMiddleWare, (req, res) => {
  return res.status(200).json({
    message: "Access granted to protected route",
    userData: req.user
  });
});

userrouter.get("/profile", authMiddleWare, getUserProfile);

module.exports = userrouter;