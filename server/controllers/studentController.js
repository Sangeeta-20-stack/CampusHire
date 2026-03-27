// controllers/studentController.js
import StudentProfile from "../models/StudentProfile.js";
import Job from "../models/Job.js";

// Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT
    const profileData = req.body;

    // Always include email from JWT user
    profileData.email = req.user.email;

    // Ensure optional arrays are at least empty arrays
    profileData.technicalSkills = profileData.technicalSkills || [];
    profileData.softSkills = profileData.softSkills || [];
    profileData.certifications = profileData.certifications || [];
    profileData.languagesKnown = profileData.languagesKnown || [];
    profileData.certificates = profileData.certificates || [];

    // Ensure booleans/numbers have defaults
    profileData.activeBacklogs = profileData.activeBacklogs || 0;
    profileData.hasBacklogs = profileData.activeBacklogs > 0;

    let profile = await StudentProfile.findOne({ userId });

    if (profile) {
      profile = await StudentProfile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true }
      );
      return res.json({ message: "Profile updated", profile });
    }

    profile = await StudentProfile.create({ userId, ...profileData });
    res.status(201).json({ message: "Profile created", profile });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Error", errors: messages });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Own Profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// View Eligible Jobs
export const getEligibleJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const jobs = await Job.find();
    const eligibleJobs = jobs.filter(job => {
      const e = job.eligibility;

      const yearCheck = e.requiredAcademicYears?.includes(profile.year);
      const cgpaCheck = profile.cgpa >= e.minCgpa;
      const branchCheck = e.allowedBranches?.includes(profile.department);
      const backlogCheck = e.noActiveBacklogs ? profile.activeBacklogs === 0 : true;
      const skillsCheck = e.requiredSkills?.every(skill => profile.technicalSkills.includes(skill)) ?? true;
      const certCheck = e.requiredCertifications?.every(cert => profile.certifications.includes(cert)) ?? true;

      return yearCheck && cgpaCheck && branchCheck && backlogCheck && skillsCheck && certCheck;
    });

    res.json(eligibleJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Partial Update Student Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Prevent changing email directly (always use req.user.email)
    if (profileData.email) delete profileData.email;

    // Update arrays safely
    if (profileData.technicalSkills && !Array.isArray(profileData.technicalSkills)) {
      profileData.technicalSkills = [profileData.technicalSkills];
    }
    if (profileData.softSkills && !Array.isArray(profileData.softSkills)) {
      profileData.softSkills = [profileData.softSkills];
    }
    if (profileData.certifications && !Array.isArray(profileData.certifications)) {
      profileData.certifications = [profileData.certifications];
    }
    if (profileData.languagesKnown && !Array.isArray(profileData.languagesKnown)) {
      profileData.languagesKnown = [profileData.languagesKnown];
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile updated", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};