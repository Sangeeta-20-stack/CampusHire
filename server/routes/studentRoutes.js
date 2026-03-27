import express from "express";
import { createOrUpdateProfile, getMyProfile, getEligibleJobs,updateProfile } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only students can access
router.post("/profile", protect(["student"]), createOrUpdateProfile);
router.get("/profile", protect(["student"]), getMyProfile);
router.get("/jobs", protect(["student"]), getEligibleJobs);
router.patch("/profile", protect(["student"]), updateProfile);
export default router;