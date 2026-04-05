import API from "./axios";

// Profile
export const getProfile = () => API.get("/students/profile");
export const updateProfile = (data) => API.patch("/students/profile", data);

// Jobs
export const getJobs = () => API.get("/students/jobs");

// Resume upload
export const uploadResume = (formData) =>
  API.post("/students/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });