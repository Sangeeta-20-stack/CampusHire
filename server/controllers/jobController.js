import Job from "../models/Job.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

// Create Job (Admin / Recruiter)
export const createJob = async (req, res) => {
  try {
    // 1. Create Job
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });

    // 2. Find all students
    const students = await User.find({ role: "student" }).select("_id");

    // 3. Create notifications for all students
    const notifications = students.map((student) =>
      createNotification({
        userId: student._id,
        title: "New Job Posted",
        message: `${job.jobTitle} at ${job.companyName}`,
        type: "job",
        link: `/jobs/${job._id}`,
      })
    );

    await Promise.all(notifications);

    // 4. Response
    res.status(201).json({
      success: true,
      message: "Job created & notifications sent",
      job,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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





export const getFilteredJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      location,
      experienceLevel,
      minCgpa,
      branch,
      skill,
      certification,
      mode,
      minSalary,
      maxSalary,
      tag,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    let filter = {};

    // ---------------- TEXT SEARCH ----------------
    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { jobTags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // ---------------- BASIC FILTERS ----------------
    if (jobType) filter.jobType = jobType;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (mode) filter["selectionProcess.mode"] = mode;

    // ---------------- ELIGIBILITY ----------------
    if (minCgpa) {
      filter["eligibility.minCgpa"] = { $lte: Number(minCgpa) };
    }

    if (branch) {
      filter["eligibility.allowedBranches"] = {
        $in: [new RegExp(branch, "i")],
      };
    }

    if (skill) {
      filter["eligibility.requiredSkills"] = {
        $in: [new RegExp(skill, "i")],
      };
    }

    if (certification) {
      filter["eligibility.requiredCertifications"] = {
        $in: [new RegExp(certification, "i")],
      };
    }

    // ---------------- TAG ----------------
    if (tag) {
      filter.jobTags = { $in: [new RegExp(tag, "i")] };
    }

    // ---------------- SALARY (FIXED LOGIC) ----------------
    if (minSalary || maxSalary) {
      const salaryConditions = [];

      if (minSalary) {
        salaryConditions.push({
          salaryRange: { $regex: new RegExp(minSalary, "i") },
        });
      }

      if (maxSalary) {
        salaryConditions.push({
          salaryRange: { $regex: new RegExp(maxSalary, "i") },
        });
      }

      // merge with existing filter safely
      filter.$and = [...(filter.$and || []), ...salaryConditions];
    }

    // ---------------- SORT ----------------
    let sortOption = {};
    if (sort === "latest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "deadline") sortOption = { applicationDeadline: 1 };
    if (sort === "company") sortOption = { companyName: 1 };

    // ---------------- PAGINATION (FIXED) ----------------
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // ---------------- QUERY ----------------
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(filter),
    ]);

    // ---------------- RESPONSE ----------------
    res.json({
      success: true,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
      count: jobs.length,
      jobs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: err.message,
    });
  }
};