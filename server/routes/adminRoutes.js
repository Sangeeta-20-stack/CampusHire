import express from "express";
import { getAnalytics } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/analytics", protect(["admin"]), getAnalytics);

export default router;