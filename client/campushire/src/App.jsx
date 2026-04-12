import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Landing from "./pages/common/Landing";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/admin/AdminLayout";

// Student
import BrowseJobs from "./pages/student/BrowseJobs";
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import JobDetails from "./pages/student/JobDetails";
import MyApplications from "./pages/student/MyApplications";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateJob from "./pages/admin/CreateJob";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageApplications from "./pages/admin/ManageApplications";
import ApplicationDetails from "./pages/admin/ApplicationDetails";
import ApplicantsPerJob from "./pages/admin/Applicantsperjob";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0b1a2f",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Student */}
        <Route element={<MainLayout />}>
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<MyApplications />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs/create" element={<CreateJob />} />
          <Route path="/admin/jobs" element={<ManageJobs />} />
          <Route path="/admin/jobs/:jobId/applicants" element={<ApplicantsPerJob />} />

          <Route path="/admin/applications" element={<ManageApplications />} />
          <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}