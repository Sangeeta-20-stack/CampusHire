export const checkEligibility = (profile, job) => {
  const e = job.eligibility;
  const reasons = [];

  if (!e) {
    return { isEligible: true, reasons: [] };
  }

  // 🎯 Year Check
  if (e.requiredAcademicYears && !e.requiredAcademicYears.includes(profile.year)) {
    reasons.push(`Eligible only for years: ${e.requiredAcademicYears.join(", ")}`);
  }

  // 🎯 CGPA Check
  if (e.minCgpa && profile.cgpa < e.minCgpa) {
    reasons.push(`Minimum CGPA required is ${e.minCgpa}`);
  }

  // 🎯 Branch Check
  if (e.allowedBranches && !e.allowedBranches.includes(profile.department)) {
    reasons.push(`Allowed branches: ${e.allowedBranches.join(", ")}`);
  }

  // 🎯 Backlog Check
  if (e.noActiveBacklogs && profile.activeBacklogs > 0) {
    reasons.push(`No active backlogs allowed`);
  }

  // 🎯 Skills Check
  if (e.requiredSkills && e.requiredSkills.length > 0) {
    const missingSkills = e.requiredSkills.filter(
      skill => !profile.technicalSkills.includes(skill)
    );
    if (missingSkills.length > 0) {
      reasons.push(`Missing skills: ${missingSkills.join(", ")}`);
    }
  }

  // 🎯 Certifications Check (optional)
  if (e.requiredCertifications && e.requiredCertifications.length > 0) {
    const missingCerts = e.requiredCertifications.filter(
      cert => !profile.certifications.includes(cert)
    );
    if (missingCerts.length > 0) {
      reasons.push(`Missing certifications: ${missingCerts.join(", ")}`);
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons
  };
};