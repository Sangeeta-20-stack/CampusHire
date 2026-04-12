import API from "./axios";

// Apply job
export const applyJob = (jobId) =>
  API.post(`/applications/${jobId}`);

// My applications
export const getMyApplications = () =>
  API.get("/applications");

// Admin: get applicants
export const getApplicationsByJob = (jobId) =>
  API.get(`/applications/job/${jobId}`);

// Update round
export const updateRound = (id, data) =>
  API.patch(`/applications/${id}/round`, data);

// Schedule interview
export const scheduleInterview = (id, data) =>
  API.patch(`/applications/${id}/schedule`, data);

// Get single application by ID (add this)
export const getApplicationById = (id) =>
  API.get(`/applications/${id}`);