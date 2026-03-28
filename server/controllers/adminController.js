import StudentProfile from "../models/StudentProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getAnalytics = async (req, res) => {
  try {
    // 🔢 Basic Counts
    const totalStudents = await StudentProfile.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // 🎯 Status Counts
    const selectedCount = await Application.countDocuments({ status: "Selected" });
    const rejectedCount = await Application.countDocuments({ status: "Rejected" });
    const inProgressCount = await Application.countDocuments({ status: "In Progress" });
    const appliedCount = await Application.countDocuments({ status: "Applied" });

    // 📊 Placement Rate
    const placementRate =
      totalApplications === 0
        ? 0
        : ((selectedCount / totalApplications) * 100).toFixed(2);

    // 🏆 Top Companies (by selections)
    const topCompanies = await Application.aggregate([
      { $match: { status: "Selected" } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $group: {
          _id: "$job.companyName",
          selectedCount: { $sum: 1 }
        }
      },
      { $sort: { selectedCount: -1 } },
      { $limit: 5 }
    ]);

    // 📈 Applications per Job
    const applicationsPerJob = await Application.aggregate([
      {
        $group: {
          _id: "$jobId",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $project: {
          jobTitle: "$job.jobTitle",
          companyName: "$job.companyName",
          count: 1
        }
      }
    ]);

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      selectedCount,
      rejectedCount,
      inProgressCount,
      appliedCount,
      placementRate,
      topCompanies,
      applicationsPerJob
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};