import API from "./axios";

// Signup
export const signupUser = (data) => {
  return API.post("/auth/signup", data);
};

// Login
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};