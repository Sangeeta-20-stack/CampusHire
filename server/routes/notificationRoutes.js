import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications
router.get("/", protect(), getNotifications);

// Mark one as read
router.patch("/:id/read", protect(), markAsRead);

// Mark all as read
router.patch("/read-all", protect(), markAllAsRead);

export default router;