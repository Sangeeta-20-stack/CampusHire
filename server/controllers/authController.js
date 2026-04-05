import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Restrict roles
    let userRole = "student";
    if (role === "admin") {
      // Only allow admin creation with secret key
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res
          .status(403)
          .json({ message: "Not authorized to create admin" });
      }
      userRole = "admin";
    }

    // Check if user already exists
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
      role: userRole,
    });

    // Sign token
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

    // ✅ FIX: Removed the x-admin-access header check.
    //
    // WHY IT WAS BROKEN:
    // The axios interceptor sets that header by reading user.role from
    // localStorage — but on the very first login, localStorage is empty,
    // so the header is never sent, and the backend returned 403.
    //
    // WHY IT'S SAFE TO REMOVE:
    // The admin role is already protected at signup (requires ADMIN_SECRET).
    // bcrypt password verification is sufficient protection at login.
    // The role stored in the DB is the source of truth — not a header
    // that any client can spoof anyway.

    // Sign token
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