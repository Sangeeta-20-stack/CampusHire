import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import Job from "../models/Job.js";
import { sendEmail } from "../utils/sendEmail.js";import { checkEligibility } from "../utils/eligibility.js";

// ---------------- Apply Job ----------------
export const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 Use utility instead of inline logic
   const { isEligible, reasons } = checkEligibility(profile, job);

if (!isEligible) {
  return res.status(400).json({
    message: "Not eligible for this job",
    reasons
  });
}

    // 🔥 Application Limit Check
    const MAX_APPLICATIONS = 5;

    if (profile.appliedJobsCount >= MAX_APPLICATIONS) {
      return res.status(400).json({
        message: `Application limit reached (${MAX_APPLICATIONS})`
      });
    }

    // ❗ Prevent duplicate applications
    const exists = await Application.findOne({
      studentId: profile._id,
      jobId: job._id
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    // 🔥 Create application with initialized rounds
    const application = await Application.create({
      studentId: profile._id,
      jobId: job._id,
      status: "Applied",
      currentRound: "Aptitude",
      rounds: [
        { roundName: "Aptitude", status: "Pending" },
        { roundName: "Technical", status: "Pending" },
        { roundName: "HR", status: "Pending" }
      ]
    });

    // ✅ Increment application count
    profile.appliedJobsCount += 1;
    await profile.save();

    res.status(201).json({
      message: "Applied successfully",
      application
    });

  } catch (error) {
    console.error(error);
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

    const application = await Application.findById(req.params.id)
      .populate("studentId")
      .populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Fix old data
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

    // ❗ Only current round allowed
    if (application.currentRound !== roundName) {
      return res.status(400).json({
        message: `Update only allowed for current round: ${application.currentRound}`
      });
    }

    // ✅ Update round
    round.status = status;
    round.feedback = feedback || "";

    if (status === "Passed" || status === "Failed") {
      round.completedAt = new Date();
    }

    // 🔥 Flow Logic
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
    } 
    else if (status === "Failed") {
      application.status = "Rejected";
      application.currentRound = "Completed";
    }

    await application.save();

    // ================= EMAIL LOGIC =================

    // 🎉 Selected
    if (application.status === "Selected") {
      await sendEmail({
        to: application.studentId.email,
        subject: `🎉 Selected - ${application.jobId.jobTitle}`,
        html: `
          <h2>Congratulations ${application.studentId.fullName}!</h2>
          <p>You have been selected for <b>${application.jobId.jobTitle}</b>.</p>
          <p><b>Company:</b> ${application.jobId.companyName}</p>
          <br/>
          <p>We wish you great success!</p>
          <p>Team CampusHire</p>
        `
      });
    }

    // ❌ Rejected
    if (application.status === "Rejected") {
      await sendEmail({
        to: application.studentId.email,
        subject: `Application Update - ${application.jobId.jobTitle}`,
        html: `
          <p>Hello ${application.studentId.fullName},</p>
          <p>We regret to inform you that you were not selected for <b>${application.jobId.jobTitle}</b>.</p>
          <p>Keep improving and applying.</p>
          <br/>
          <p>Best wishes,</p>
          <p>Team CampusHire</p>
        `
      });
    }

    // 📩 Optional: Round Passed Notification
    if (status === "Passed" && application.status !== "Selected") {
      await sendEmail({
        to: application.studentId.email,
        subject: `Round Cleared - ${roundName}`,
        html: `
          <p>Hello ${application.studentId.fullName},</p>
          <p>You have successfully cleared the <b>${roundName}</b> round.</p>
          <p>Next round: <b>${application.currentRound}</b></p>
          <br/>
          <p>Prepare well!</p>
          <p>Team CampusHire</p>
        `
      });
    }

    res.json({
      message: "Round updated",
      currentRound: application.currentRound,
      overallStatus: application.status,
      application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { roundName, interviewDate, interviewMode, meetingLink } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("studentId")
      .populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const round = application.rounds.find(r => r.roundName === roundName);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    round.interviewDate = interviewDate;
    round.interviewMode = interviewMode;
    round.meetingLink = meetingLink;
    round.status = "Scheduled";

    await application.save();

    // 📧 Send Email
    await sendEmail({
      to: application.studentId.email,
      subject: `Interview Scheduled - ${application.jobId.jobTitle}`,
      html: `
        <h2>Interview Scheduled</h2>
        <p>Hello ${application.studentId.fullName},</p>
        <p>Your <b>${roundName}</b> round has been scheduled.</p>
        <p><b>Date:</b> ${new Date(interviewDate).toLocaleString()}</p>
        <p><b>Mode:</b> ${interviewMode}</p>
        <p><b>Meeting Link:</b> <a href="${meetingLink}">${meetingLink}</a></p>
        <br/>
        <p>Best of luck!</p>
        <p>Team CampusHire</p>
      `
    });

    res.json({ message: "Interview scheduled & email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};