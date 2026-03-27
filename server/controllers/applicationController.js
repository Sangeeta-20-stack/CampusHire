import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import Job from "../models/Job.js";

// ---------------- Apply Job ----------------
export const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const e = job.eligibility;

    const isEligible =
      e.requiredAcademicYears?.includes(profile.year) &&
      profile.cgpa >= e.minCgpa &&
      e.allowedBranches?.includes(profile.department) &&
      (e.noActiveBacklogs ? profile.activeBacklogs === 0 : true) &&
      (e.requiredSkills?.every(skill => profile.technicalSkills.includes(skill)) ?? true);

    if (!isEligible) {
      return res.status(400).json({ message: "Not eligible" });
    }

    const exists = await Application.findOne({
      studentId: profile._id,
      jobId: job._id
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    // 🔥 Initialize rounds
    const application = await Application.create({
      studentId: profile._id,
      jobId: job._id,
      status: "Applied",
      currentRound: "Aptitude",
      rounds: [
        { roundName: "Aptitude" },
        { roundName: "Technical" },
        { roundName: "HR" }
      ]
    });

    profile.appliedJobsCount += 1;
    await profile.save();

    res.status(201).json({ message: "Applied successfully", application });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Get My Applications ----------------
export const getMyApplications = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    const applications = await Application.find({ studentId: profile._id })
      .populate("jobId", "jobTitle companyName location");

    res.json(applications);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Admin: View Applications ----------------
export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("studentId", "fullName cgpa department")
      .populate("jobId", "jobTitle companyName");

    res.json(applications);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Update Round ----------------
export const updateRoundStatus = async (req, res) => {
  try {
    const { roundName, status, feedback } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    const round = application.rounds.find(r => r.roundName === roundName);
    if (!round) return res.status(404).json({ message: "Round not found" });

    round.status = status;
    round.feedback = feedback;
    round.completedAt = new Date();

    // 🔥 Move forward
    if (status === "Passed") {
      if (roundName === "Aptitude") {
        application.currentRound = "Technical";
        application.status = "In Progress";
      } else if (roundName === "Technical") {
        application.currentRound = "HR";
      } else if (roundName === "HR") {
        application.currentRound = "Completed";
        application.status = "Selected";
      }
    } else {
      application.status = "Rejected";
      application.currentRound = "Completed";
    }

    await application.save();

    res.json({ message: "Round updated", application });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { roundName, interviewDate, interviewMode, meetingLink } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Fix old applications
    if (!application.rounds || application.rounds.length === 0) {
      application.rounds = [
        { roundName: "Aptitude" },
        { roundName: "Technical" },
        { roundName: "HR" }
      ];
      application.currentRound = "Aptitude";
    }

    const round = application.rounds.find(r => r.roundName === roundName);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    // ❗ Only schedule current round
    if (application.currentRound !== roundName) {
      return res.status(400).json({
        message: `You can only schedule current round: ${application.currentRound}`
      });
    }

    // ✅ Set interview details
    round.interviewDate = interviewDate;
    round.interviewMode = interviewMode;
    round.meetingLink = meetingLink;
    round.status = "Scheduled";

    await application.save();

    res.json({
      message: "Interview scheduled",
      round,
      currentRound: application.currentRound
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};