import express from "express";
import {
  createOrUpdateProfile,
  uploadResume,
  getMyProfile,
  getEligibleJobs,
  updateProfile
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* =========================
   PROFILE ROUTES
========================= */

// Create profile
router.post("/profile", protect(["student"]), createOrUpdateProfile);

// Get profile
router.get("/profile", protect(["student"]), getMyProfile);

// Update profile
router.patch("/profile", protect(["student"]), updateProfile);

/* =========================
   JOB ROUTES
========================= */

// Get eligible jobs
router.get("/jobs", protect(["student"]), getEligibleJobs);

/* =========================
   FILE UPLOAD ROUTES
========================= */

router.post("/upload-resume", upload.single("file"), uploadResume);

export default router;