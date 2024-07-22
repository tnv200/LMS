import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../Config";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminReport.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext";
import { saveAs } from 'file-saver';
import { writeFile, utils as XLSXUtils } from 'xlsx';

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
  console.log(filteredPerformanceTrackingData)
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
      "User ID,User Name,Course Name,Assessment Title,Marks Scored,Maximum Marks,Pass Marks,Result\n" +
      filteredPerformanceTrackingData.map(performance =>
        `${performance.user?.userid},${performance.user?.username},${performance.course?.coursename},${performance.assessment?.assessmentTitle},${performance.marks},${performance.assessment?.maximumMarks},${performance.assessment?.passingMarks},${performance?.marks>performance.assessment?.passingMarks ? "Pass":"Fail"}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Candidate_Report.csv");
    document.body.appendChild(link);
    link.click();
  };
  
  const downloadExcel = async () => {
    if (filteredPerformanceTrackingData.length === 0) {
      alert("No reports available to download.");
      return;
    }
    const rows = filteredPerformanceTrackingData.map(performance => ({
      'User ID': performance.user?.userid,
      'Username': performance.user?.username,
      'Course Name': performance.course?.coursename,
      'Assessment Title': performance.assessment?.assessmentTitle,
      'Marks Scored': performance.marks,
      'Maximum Marks': performance.assessment?.maximumMarks,
      'Pass Marks': performance.assessment?.passingMarks,
      'Result': performance.marks > performance.assessment?.passingMarks ? 'Pass' : 'Fail',
    }));
    const worksheet = XLSXUtils.json_to_sheet(rows, {
      header: ['User ID', 'Username', 'Course Name', 'Assessment Title', 'Marks Scored', 'Maximum Marks', 'Pass Marks', 'Result'],
    });
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Assessment_Results');
    try {
      // Save the workbook to an Excel file
      const blob = await writeFile(workbook, 'Assessment_Results.xlsx', { bookType: 'xlsx', type: 'blob' });
      saveAs(blob, 'Assessment_Results.xlsx');
    } catch (error) {
      console.error("Error writing Excel file:", error);
    }
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
            <button className="csv-buttonDownload" onClick={downloadCSV}>Download CSV</button>
            <button className="buttonDownload" onClick={downloadExcel}>Download Excel</button>
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
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {console.log(filteredPerformanceTrackingData)}
                {filteredPerformanceTrackingData.map((performance, index) => (
                  
                  <tr key={index}>
                    <td>{performance.user?.userid}</td>
                    <td>{performance.user?.username}</td>
                    <td>{performance.course?.coursename}</td>
                    <td>{performance.assessment?.assessmentTitle}</td>
                    <td>{performance.marks}</td>
                    <td>{performance.assessment?.maximumMarks}</td>
                    <td>{performance.assessment?.passingMarks}</td>
                    <td>{performance.marks>performance.assessment?.passingMarks ? "Pass":"Fail"}</td>
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
