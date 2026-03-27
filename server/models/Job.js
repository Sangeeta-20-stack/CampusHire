// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  // ---------------- Basic Info ----------------
  jobTitle: { type: String, required: true }, // e.g., Software Engineer
  companyName: { type: String, required: true },
  companyLogo: { type: String }, // URL to logo
  jobType: { type: String, enum: ["Full-time", "Internship", "Part-time", "Contract"], required: true },
  location: { type: String }, // City / Remote / Hybrid
  postingDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date, required: true },

  // ---------------- Eligibility Criteria ----------------
  eligibility: {
    requiredAcademicYears: [{ type: Number, enum: [1,2,3,4] }], // e.g., 3rd, 4th year
    minCgpa: { type: Number }, // minimum CGPA
    allowedBranches: [{ type: String }], // e.g., CS, IT, ECE
    noActiveBacklogs: { type: Boolean, default: true },
    requiredSkills: [{ type: String }], // programming languages, tools, frameworks
    requiredCertifications: [{ type: String }] // optional mandatory certifications
  },

  // ---------------- Job Requirements & Responsibilities ----------------
  keyResponsibilities: [{ type: String }], // bullet points
  technicalRequirements: [{ type: String }], // languages, frameworks, tools
  softSkillsRequirements: [{ type: String }], // communication, teamwork, problem-solving
  experienceLevel: { type: String, enum: ["Freshers", "Interns", "Experienced"], default: "Freshers" },

  // ---------------- Compensation & Benefits ----------------
  salaryRange: { type: String }, // e.g., 6-10 LPA or 20-25k stipend
  perks: [{ type: String }], // insurance, flexible work, bonuses, travel allowance

  // ---------------- Selection Process ----------------
  selectionProcess: {
    stages: [{ type: String }], // Aptitude Test → Technical → HR
    mode: { type: String, enum: ["Online", "On-campus", "Hybrid"], default: "Online" },
    numberOfRounds: { type: Number, default: 3 },
    specialInstructions: { type: String } // e.g., coding platform, resume format
  },

  // ---------------- Application Details ----------------
  applicationLink: { type: String }, // form or portal URL
  requiredDocuments: [{ type: String }], // resume, transcripts, certificates
  contactPerson: { type: String }, // HR Name
  contactEmail: { type: String }, // HR Email

  // ---------------- Tags / Quick Info for UI ----------------
  jobTags: [{ type: String }], // Internship, Full-time, Remote, On-site
  eligibilityTags: [{ type: String }], // GPA ≥ 8.0, No Backlogs, DSA Skills Required
  companyRating: { type: Number, min: 0, max: 5 }, // optional
  companyReviews: [{ type: String }], // optional

  // ---------------- System Info ----------------
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Admin or Recruiter
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);