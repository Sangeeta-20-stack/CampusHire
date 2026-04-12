import API from "./axios";

// Create Job
export const createJob = (data) => API.post("/jobs", data);

// Get all jobs
export const getAllJobs = () => API.get("/jobs");

// ✅ ADD THIS
export const getJobById = (id) => API.get(`/jobs/${id}`);