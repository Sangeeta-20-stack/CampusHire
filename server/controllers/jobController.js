import Job from "../models/Job.js";

// Create Job (Admin / Recruiter)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id
    });

    res.status(201).json({ message: "Job created", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email role");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};