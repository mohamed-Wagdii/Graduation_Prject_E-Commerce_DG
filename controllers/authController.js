const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("./validation/authValidation");
const { sendVerificationEmail } = require("../utils/sendEmail");

// ================================
// REGISTER
// ================================
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    const { username, email, password, role } = value;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: "Account Already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      msg: "Account created! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================================
// VERIFY EMAIL
// ================================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null; // امسح التوكن بعد الاستخدام
    await user.save();

    res.status(200).json({ msg: "Email verified successfully! You can now login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================================
// LOGIN
// ================================
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Account Not Found, Please Create Account" });
    }

   

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: "Login successful" , token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================================
// LOGOUT
// ================================
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  logoutUser,
  verifyEmail,
};