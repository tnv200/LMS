import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../Config";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminReport.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext";
import { saveAs } from 'file-saver';

const AdminReport = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    // If the user is not authenticated, navigate to the login page
    if (!userDetails) {
      navigate("/admin-login");
    }
    if (userDetails && userDetails.usertype !== "admin") {
      navigate("/admin-login");
    }
  }, [userDetails, navigate]);
  const [performanceTrackingData, setPerformanceTrackingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPerformanceTrackingData();
  }, []);

  const loadPerformanceTrackingData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/performancetracking`);
      setPerformanceTrackingData(response.data);
    } catch (error) {
      console.error("Error loading performance tracking data:", error);
    }
  };
  const filteredPerformanceTrackingData = performanceTrackingData.filter(
    (performance) =>
      (performance.user?.userid || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (performance.user?.username || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (performance.assessment?.assessmentTitle || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (performance.course?.coursename || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const downloadCSV = () => {

    if (filteredPerformanceTrackingData.length === 0) {
      alert("No reports available to download.");
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8," +
      "User ID,User Name,Course Name,Assessment Title,Marks Scored,Maximum Marks,Pass Marks\n" +
      filteredPerformanceTrackingData.map(performance =>
        `${performance.user?.userid},${performance.user?.username},${performance.course?.coursename},${performance.assessment?.assessmentTitle},${performance.marks},${performance.assessment?.maximumMarks},${performance.assessment?.passingMarks}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Candidate_Report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <div className="report-main">
        <h1 className="page-title">Assessments Reports</h1>
        <div className="report-content">
          <div className="search-bar">
            {/* Search Bar Component */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <a href="#">
              <i className="fa fa-search" aria-hidden="true"></i>
            </a>
          </div>

          <div className="report-table-container">
            <h3>Candidates Report</h3>
            <button className="buttonDownload" onClick={downloadCSV}>Download CSV</button>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Course Name</th>
                  <th>Assessment Title</th>
                  <th>Marks Scored</th>
                  <th>Maximum Marks</th>
                  <th>Pass Marks</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformanceTrackingData.map((performance, index) => (
                  <tr key={index}>
                    <td>{performance.user?.userid}</td>
                    <td>{performance.user?.username}</td>
                    <td>{performance.course?.coursename}</td>
                    <td>{performance.assessment?.assessmentTitle}</td>
                    <td>{performance.marks}</td>
                    <td>{performance.assessment?.maximumMarks}</td>
                    <td>{performance.assessment?.passingMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default AdminReport;
