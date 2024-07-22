import { useState } from "react";
import "./App.css";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard/AdminDashboard";
import AdminCourse from "./Components/Admin/AdminCourse/AdminCourse";
import AdminAssessment from "./Components/Admin/AdminAssessment/AdminAssessment";
import AdminReport from "./Components/Admin/AdminReport/AdminReport";
import AdminFeedback from "./Components/Admin/AdminFeedback/AdminFeedback";
import ResetPassword from "./Components/Admin/ResetPassword/ResetPassword";
import SelectUser from "./Components/SelectUser/SelectUser";
import AdminLogin from "./Components/Admin/AdminLogin/AdminLogin";
import CandidateLogin from "./Components/Candidate/CandidateLogin/CandidateLogin";
import CandidateDashboard from "./Components/Candidate/CandidateDashboard/CandidateDashboard";
import CandidateCourse from "./Components/Candidate/CandidateCourse/CandidateCourse";
import CandidateFeedback from "./Components/Candidate/CandidateFeedback/CandidateFeedback";
import CandidateResetPassword from "./Components/Candidate/CandidateResetPassword/CandidateResetPassword";
import CandidateAssessment from "./Components/Candidate/CandidateAsessment/CandidateAssessment";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<SelectUser />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-course" element={<AdminCourse />} />
            <Route path="/admin-assessment" element={<AdminAssessment />} />
            <Route path="/admin-report" element={<AdminReport />} />
            <Route path="/admin-feedback" element={<AdminFeedback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/candidate-login" element={<CandidateLogin />} />
            <Route
              path="/candidate-dashboard"
              element={<CandidateDashboard />}
            />
            <Route path="/course" element={<CandidateCourse />} />
            <Route
              path="/candidate-password"
              element={<CandidateResetPassword />}
            />
            <Route path="/feedback" element={<CandidateFeedback />} />
            <Route path="/assessment" element={<CandidateAssessment />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
