import React, { useEffect, useState } from "react";
import { useUser } from "../../../UserContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminFeedback.css";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const AdminFeedback = () => {
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
  const [manageFeedbackActive, setManageFeedbackActive] = useState(false);
  const [feedbacksSent, setFeedbacksSent] = useState([]);
  const [feedbacksReceived, setFeedbacksReceived] = useState([]);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState("");
  const [courseDetailsList, setCourseDetailsList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [userDetailsList, setUserDetailsList] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course`);
        setCourseDetailsList(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
        const candidateUsers = response.data.filter(
          (user) => user.usertype === "candidate"
        );
        setUserDetailsList(candidateUsers);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const [feedbackform, newFeedbackForm] = useState({
    user: {
      userid: userDetails?.userid,
    },
    course: {
      courseid: "",
    },
    recipientUser: {
      userid: "",
    },
    feedbackText: "",
    dateSubmitted: "",
  });

  const handleFeedbackFormChange = (event) => {
    newFeedbackForm({
      ...feedbackform,
      course: {
        courseid: event.target.name === "course" ? event.target.value : "",
      },
      recipientUser: {
        userid: event.target.name === "recipientUser" ? event.target.value : "",
      },
      [event.target.name]:
        event.target.name === "dateSubmitted"
          ? new Date(event.target.value).toISOString().split("T")[0]
          : event.target.name === "user"
          ? { userid: event.target.value }
          : event.target.value,
    });
  };

  const handleFeedbackFormSubmit = async (event) => {
    event.preventDefault();

    const isCourseIdEmpty = selectedCourseId === "";

    const feedbackData = {
      user: { userid: userDetails.userid },
      recipientUser: { userid: selectedAdminUserId },
      feedbackText: feedbackform.feedbackText,
      dateSubmitted: feedbackform.dateSubmitted,
      ...(isCourseIdEmpty ? {} : { course: { courseid: selectedCourseId } }),
    };

    try {
      await axios.post(`${API_BASE_URL}/feedback`, feedbackData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSelectedAdminUserId("");
      setSelectedCourseId("");
      newFeedbackForm({
        user: { userid: "" },
        course: { courseid: "" },
        recipientUser: { userid: "" },
        feedbackText: "",
        dateSubmitted: "",
      });
      console.log("Feedback Sent Successfully!");
      alert("Feedback Sent Successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error submitting form");
    }
  };

  const toggleManageFeedback = async () => {
    setManageFeedbackActive(!manageFeedbackActive);
    const usertypeadmin = "admin";
    const usertypecandidate = "candidate";

    try {
      // Fetch feedbacks based on the user type (admin or candidate)
      const responseadmin = await axios.get(
        `${API_BASE_URL}/feedback/user/usertype/${usertypeadmin}`
      );

      const responsecandidate = await axios.get(
        `${API_BASE_URL}/feedback/user/usertype/${usertypecandidate}`
      );

      setFeedbacksSent(responseadmin.data);

      setFeedbacksReceived(responsecandidate.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <div className="admin-feedback-main">
        <div className="manage-feedback-btn">
          <button className="view-fb" onClick={toggleManageFeedback}>
            View Feedbacks
          </button>
        </div>

        {manageFeedbackActive ? (
          <div className="manage-feedback">
            {/* Section for Sent Feedbacks */}
            <div className="admin-sent-feedbacks">
              <h2>Sent Feedbacks</h2>
              {feedbacksSent.map((feedback) => (
                <div key={feedback.id} className="admin-feedback-item">
                  {/* Adjust property names based on your actual API response */}
                  <p>Candidate ID : {feedback.recipientUser?.userid}</p>
                  <p>Candidate Name : {feedback.recipientUser?.username}</p>
                  {feedback.course?.coursename ? (
                    <p>Course: {feedback.course.coursename}</p>
                  ) : (
                    <p>General Feedback</p>
                  )}
                  <p>Date : {feedback.dateSubmitted}</p>
                  <p>Feedback : {feedback.feedbackText}</p>
                </div>
              ))}
            </div>

            {/* Section for Received Feedbacks */}
            <div className="admin-received-feedbacks">
              <h2>Received Feedbacks</h2>
              {feedbacksReceived.map((feedback) => (
                <div key={feedback.id} className="admin-feedback-item">
                  {/* Adjust property names based on your actual API response */}
                  <p>Sender ID : {feedback.user?.userid}</p>
                  <p>Sender Name : {feedback.user?.username}</p>
                  {feedback.course?.coursename ? (
                    <p>Course: {feedback.course.coursename}</p>
                  ) : (
                    <p>General Feedback</p>
                  )}
                  <p>Date : {feedback.dateSubmitted}</p>
                  <p>Feedback : {feedback.feedbackText}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="feedback-area">
            <div className="testbox">
              <form onSubmit={handleFeedbackFormSubmit}>
                <p id="h1">Feedback Form</p>

                <p id="h4">Select User</p>
                <select
                  className="input"
                  name="recipientUser"
                  value={selectedAdminUserId}
                  onChange={(event) =>
                    setSelectedAdminUserId(event.target.value)
                  }
                >
                  <option value="">Select User</option>
                  {userDetailsList.map((admin) => (
                    <option key={admin.userid} value={admin.userid}>
                      {admin.username} - {admin.userid}
                    </option>
                  ))}
                </select>
                <p id="h4">Select Course</p>
                <select
                  className="input"
                  name="course"
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                >
                  <option value="">
                    Select Course (or leave empty for General Feedback)
                  </option>
                  {courseDetailsList.map((course) => (
                    <option key={course.courseid} value={course.courseid}>
                      {course.coursename}
                    </option>
                  ))}
                </select>

                {/* Date Input */}
                <p id="h4">Select a Date</p>
                <input
                  id="date"
                  type="date"
                  className="input"
                  name="dateSubmitted"
                  value={feedbackform.dateSubmitted}
                  onChange={handleFeedbackFormChange}
                />

                <p id="h4">Write your feedback here</p>
                <textarea
                  id="textarea"
                  rows="5"
                  name="feedbackText"
                  value={feedbackform.feedbackText}
                  onChange={handleFeedbackFormChange}
                ></textarea>
                {/* <div className="btn-block">
                  <button type="submit">Send Feedback</button>
                </div> */}

                <div className="button">
                  <button type="submit" className="send-button">
                    <div class="svg-wrapper-1">
                      <div class="svg-wrapper">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path
                            fill="currentColor"
                            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default AdminFeedback;
