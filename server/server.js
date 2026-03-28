import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

// Cloudinary (keep after dotenv)
import cloudinary from "./config/cloudinary.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Optional: Socket (for real-time notifications)
import { initSocket } from "./socket/socket.js";

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // important for forms

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.send("CampusHire API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// ---------------- SERVER + SOCKET ----------------
const server = http.createServer(app);
const io = initSocket(server); // initialize socket

// (Optional) Make io accessible globally
export { io };

// ---------------- DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connection opened");

  server.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});