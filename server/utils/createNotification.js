import Notification from "../models/Notification.js";
import { io } from "../server.js"; // import socket instance

export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
  link = "",
}) => {
  try {
    // 1. Save to DB
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    });

    // 2. Real-time emit (SAFE)
    if (io) {
      io.to(userId.toString()).emit("newNotification", notification);
    }

    return notification;

  } catch (error) {
    console.error("Notification Error:", error);
    return null; // prevent breaking main flow
  }
};