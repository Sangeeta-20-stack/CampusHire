import axios from "axios";

const API = axios.create({
  baseURL: "https://campushire-backend-epmn.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  req.headers = req.headers || {};

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (user?.role === "admin") {
    req.headers["x-admin-access"] = "true";
  }

  return req;
});

export default API;
