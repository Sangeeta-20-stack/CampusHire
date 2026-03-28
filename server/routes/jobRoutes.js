import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  getFilteredJobs,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin & Recruiter only
router.post("/", protect(["admin", "recruiter"]), createJob);
router.patch("/:id", protect(["admin", "recruiter"]), updateJob);
router.delete("/:id", protect(["admin", "recruiter"]), deleteJob);

// Public / Student
router.get("/", getAllJobs);
router.get("/:id", getJobById);
// Public / Student (ADVANCED SEARCH HERE)
router.get("/", getFilteredJobs);

export default router;