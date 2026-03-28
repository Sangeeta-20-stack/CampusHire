import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // ❌ Restrict roles (no recruiter)
    let userRole = "student";
    if (role === "admin") {
      // 🔐 Only allow admin creation with secret
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Not authorized to create admin" });
      }
      userRole = "admin";
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Extra admin protection
    if (user.role === "admin") {
      const adminHeader = req.headers["x-admin-access"];
      if (adminHeader !== "true") {
        return res.status(403).json({
          message: "Admin access denied (missing header)"
        });
      }
    }

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};