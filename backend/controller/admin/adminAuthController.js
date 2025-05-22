const User = require("../../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against .env super admin credentials first
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Issue a token for the super admin
      const token = jwt.sign(
        { email, role: "admin", superAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        success: true,
        message: "Super admin login successful",
        token,
        user: {
          email,
          fullname: "Super Admin",
          role: "admin",
          superAdmin: true
        }
      });
    }

    // Otherwise, check in the database for admin users
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        fullname: admin.fullname || admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication"
    });
  }
};

module.exports = { adminLogin };
