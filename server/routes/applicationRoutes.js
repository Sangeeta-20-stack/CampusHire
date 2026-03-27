// routes/applicationRoutes.js
import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicationsByJob,
  updateRoundStatus,
  scheduleInterview
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/:jobId", protect(["student"]), applyJob);
router.get("/", protect(["student"]), getMyApplications);

// Admin / Recruiter
router.get("/job/:jobId", protect(["admin", "recruiter"]), getApplicationsByJob);
router.patch("/:id/round", protect(["admin", "recruiter"]), updateRoundStatus);
router.patch("/:id/schedule", protect(["admin","recruiter"]), scheduleInterview);

export default router;