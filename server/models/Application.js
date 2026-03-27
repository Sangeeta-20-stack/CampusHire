// models/Application.js
import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  roundName: {
    type: String,
    enum: ["Aptitude", "Technical", "HR"],
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Scheduled", "Passed", "Failed"],
    default: "Pending"
  },
  feedback: String,
  completedAt: Date,

  // 🔥 NEW FIELDS
  interviewDate: Date,
  interviewMode: {
    type: String,
    enum: ["Online", "On-campus", "Hybrid"]
  },
  meetingLink: String
});

const applicationSchema = new mongoose.Schema({
  // ---------------- References ----------------
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

  // ---------------- Overall Status ----------------
  status: { 
    type: String, 
    enum: ["Applied", "In Progress", "Selected", "Rejected"], 
    default: "Applied" 
  },

  // ---------------- Multi-Round System ----------------
  rounds: [roundSchema],

  currentRound: {
    type: String,
    enum: ["Aptitude", "Technical", "HR", "Completed"],
    default: "Aptitude"
  },

  appliedAt: { type: Date, default: Date.now },

  // ---------------- Documents ----------------
  resume: { type: String },
  transcripts: { type: String },
  certificates: [{ type: String }],

  // ---------------- Extra ----------------
  remarks: { type: String },
  attemptCount: { type: Number, default: 1 }

}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);