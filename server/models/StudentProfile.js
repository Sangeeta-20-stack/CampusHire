// models/StudentProfile.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  // ---------------- Personal Information ----------------
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  profilePhoto: { type: String }, // URL or file path
  email: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  address: { type: String },
  
  // ---------------- Academic Information ----------------
  university: { type: String },
  department: { type: String }, // Branch / Major
  year: { type: Number }, // 1,2,3,4
  semester: { type: Number },
  cgpa: { type: Number },
  activeBacklogs: { type: Number, default: 0 },
  hasBacklogs: { type: Boolean, default: false },
  class12Marks: { type: Number }, // optional
  graduationDate: { type: Date },
  
  // ---------------- Skills & Competencies ----------------
  technicalSkills: [{ type: String }], // programming languages, frameworks, tools
  softSkills: [{ type: String }], // communication, teamwork, leadership
  certifications: [{ type: String }], // Coursera, Udemy, GATE, etc.
  languagesKnown: [{ type: String }],
  
  // ---------------- Resume & Documents ----------------
  resume: { type: String }, // PDF/DOCX URL or path
  academicTranscripts: { type: String }, // PDF/DOCX URL or path
  certificates: [{ type: String }], // optional
  portfolioLink: { type: String }, // GitHub / personal website
  linkedInLink: { type: String },
  preferredLocation: { type: String }, // City or Remote

  // ---------------- System Info ----------------
  appliedJobsCount: { type: Number, default: 0 } // For application limit check
}, { timestamps: true });

export default mongoose.model("StudentProfile", studentSchema);