const usermodel = require("../Models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
  try {
    const { fullName, userName, phoneNumber, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const registeredUser = await usermodel.create({
      fullName,
      userName, 
      phoneNumber,
      email,
      password: hashedPassword,
    });

    if (registeredUser) {
      const userResponse = registeredUser.toObject();
      delete userResponse.password;

      return res.status(201).json({
        message: "User registered successfully",
        data: userResponse,
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Something went wrong, please try again", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });

 const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1d" }
);
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
const getUserProfile = async (req, res) => {
  try {
    // req.user.id comes from your authMiddleWare
    const user = await usermodel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { Signup, Login, getUserProfile };