import React, { useEffect, useState } from "react";
import { useUser } from "../../../UserContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminCourse.css";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const { userDetails } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userDetails) {
      navigate("/admin-login");
    }
    if (userDetails && userDetails.usertype !== "admin") {
      navigate("/admin-login");
    }
  }, [userDetails, navigate]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [contentTypeOptions, setContentTypeOptions] = useState([
    "video",
    "document",
  ]);
  useEffect(() => {
    setContentTypeOptions(["video", "document"]);
  }, []);
  const [newCourse, setNewCourse] = useState({
    coursename: "",
    coursedescription: "",
    uploadedByUser: {
      userid: userDetails?.userid,
    },
    uploadedDate: "",
  });
  const [courseContent, setCourseContent] = useState({
    course: {
      courseid: "",
    },
    contenttype: "",
    contentdescription: "",
    contenturl: "",
    uploadedByUser: {
      userid: userDetails?.userid,
    },
    uploadedDate: "",
  });
  const [showContentForm, setShowContentForm] = useState(false);
  const [showContentView, setShowContentView] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course`);
      setCourses(response.data);
      setCourseOptions(response.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleAddContentClick = (course) => {
    setSelectedCourse(course);
    setShowContentForm(true);
    setShowContentView(false);
  };

  const handleViewContentClick = async (course) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/coursecontent/byCourse/${course.courseid}`
      );
      setCourseContent(response.data);
      setSelectedCourse(course);
      setShowContentForm(false);
      setShowContentView(true);
    } catch (error) {
      console.error("Error loading course content:", error);
    }
  };

  const handleDeleteContentClick = async (content) => {
    const confirmed = window.confirm("Are you sure you want to delete this content?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/coursecontent/${content.contentid}`);
        await handleViewContentClick(selectedCourse);
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    }
  };
  

  const handleDeleteCourseClick = async (course) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/course/${course.courseid}`);
        loadCourses();
        setSelectedCourse(null);
        setShowContentForm(false);
        setShowContentView(false);
      } catch (error) {
        alert("The selected course is already mapped");
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleCourseChange = (event) => {
    setCourseContent({
      ...courseContent,
      [event.target.name]:
        event.target.name === "course"
          ? {
              courseid:
                event.target.value === ""
                  ? ""
                  : isNaN(parseInt(event.target.value))
                  ? "It should be a number"
                  : parseInt(event.target.value),
            }
          : event.target.name === "uploadedByUser"
          ? {
              userid:
                event.target.value === ""
                  ? ""
                  : isNaN(parseInt(event.target.value))
                  ? "It should be a number"
                  : parseInt(event.target.value),
            }
          : event.target.value,
    });
  };

  const handleNewCourseChange = (event) => {
    setNewCourse({
      ...newCourse,
      [event.target.name]:
        event.target.name === "uploadedDate"
          ? new Date(event.target.value).toISOString().split("T")[0]
          : event.target.name === "uploadedByUser"
          ? {
              userid:
                event.target.value === ""
                  ? ""
                  : isNaN(parseInt(event.target.value))
                  ? "It should be a number"
                  : parseInt(event.target.value),
            }
          : event.target.value,
    });
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();

    try {
      // Adding new content to the selected course
      await axios.post(`${API_BASE_URL}/coursecontent`, courseContent, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCourseContent({
        course: {
          courseid: "",
        },
        contenttype: "",
        contentdescription: "",
        contenturl: "",
        uploadedByUser: {
          userid: userDetails.userid,
        },
        uploadedDate: "",
      });

      setSelectedCourse(null);
      setShowContentForm(false);
      setShowContentView(false);
      loadCourses();
    } catch (error) {
      console.error("Error submitting course content:", error);
    }
  };

  const handleNewCourseSubmit = async (event) => {
    event.preventDefault();

    try {
      // Adding a new course
      await axios.post(`${API_BASE_URL}/course`, newCourse, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNewCourse({
        coursename: "",
        coursedescription: "",
        uploadedByUser: {
          userid: userDetails.userid,
        },
        uploadedDate: "",
      });

      setSelectedCourse(null);
      setShowContentForm(false);
      setShowContentView(false);
      loadCourses();
    } catch (error) {
      console.error("Error submitting new course:", error);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowContentForm(false);
    setShowContentView(false);
  };

  const handleNewCourseClick = () => {
    setSelectedCourse(null);
    setShowContentForm(false);
    setShowContentView(false);
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
      <div className="course-main">
        <div className="course-management-container">
          <h1 className="page-title">Course Management</h1>

          {/* Courses Table */}
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Course Description</th>
                <th>Uploaded By</th>
                <th>Upload Date</th>
                <th>Add Content</th>
                <th>View Content</th>
                <th>Delete Course</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index} className="course-row">
                  <td>{course?.courseid}</td>
                  <td onClick={() => handleCourseClick(course)}>
                    {course.coursename}
                  </td>
                  <td>{course.coursedescription}</td>
                  <td>
                    {course.uploadedByUser?.username}-
                    {course.uploadedByUser?.userid}
                  </td>
                  <td>{course.uploadedDate}</td>
                  <td>
                    <button
                      className="add-content-table-button"
                      onClick={() => handleAddContentClick(course)}
                    >
                      Add Content
                    </button>
                  </td>
                  <td>
                    <button
                      className="view-content-table-button"
                      onClick={() => handleViewContentClick(course)}
                    >
                      View Content
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-course-table-button"
                      onClick={() => handleDeleteCourseClick(course)}
                    >
                      Delete Course
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Selected Course Details */}
          {selectedCourse && (
            <div className="selected-course-details">
              <h2 className="selected-course-title">
                {selectedCourse.coursename}
              </h2>

              {/* Display Course Contents */}
              {showContentView && (
                <div className="course-contents">
                  {courseContent && courseContent.length > 0 ? (
                    courseContent.map((content, index) => (
                      <div key={index} className="content-item">
                        <h3>Content {index + 1}</h3>
                        <p>Type: {content.contenttype}</p>
                        <p>Description: {content.contentdescription}</p>
                        <p>
                          URL:{" "}
                          <a href={content.contenturl} target="_blank">
                            {content.contenturl}
                          </a>
                        </p>
                        <p>
                          Uploaded By: {content.uploadedByUser?.userid} -{" "}
                          {content.uploadedByUser?.username}
                        </p>
                        <p>Upload Date: {content.uploadedDate}</p>
                        <button
                          className="bin-button"
                          onClick={() => handleDeleteContentClick(content)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 39 7"
                            class="bin-top"
                          >
                            <line
                              stroke-width="4"
                              stroke="white"
                              y2="5"
                              x2="39"
                              y1="5"
                            ></line>
                            <line
                              stroke-width="3"
                              stroke="white"
                              y2="1.5"
                              x2="26.0357"
                              y1="1.5"
                              x1="12"
                            ></line>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 33 39"
                            class="bin-bottom"
                          >
                            <mask fill="white" id="path-1-inside-1_8_19">
                              <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                            </mask>
                            <path
                              mask="url(#path-1-inside-1_8_19)"
                              fill="white"
                              d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                            ></path>
                            <path
                              stroke-width="4"
                              stroke="white"
                              d="M12 6L12 29"
                            ></path>
                            <path
                              stroke-width="4"
                              stroke="white"
                              d="M21 6V29"
                            ></path>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 89 80"
                            class="garbage"
                          >
                            <path
                              fill="white"
                              d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No content available for this course.</p>
                  )}
                </div>
              )}

              {/* Content Form */}
              {showContentForm && (
                <form
                  onSubmit={handleCourseSubmit}
                  className="course-content-form"
                >
                  <label htmlFor="courseId">Select Course:</label>
                  <select
                    id="courseId"
                    name="course"
                    value={courseContent.course?.courseid}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course) => (
                      <option key={course.courseid} value={course.courseid}>
                        {course.coursename}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="contentType">Content Type:</label>
                  <select
                    id="contentType"
                    name="contenttype"
                    value={courseContent.contenttype}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select Content Type</option>
                    {contentTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="contentDescription">
                    Content Description:
                  </label>
                  <input
                    type="text"
                    id="contentDescription"
                    name="contentdescription"
                    value={courseContent.contentdescription}
                    onChange={handleCourseChange}
                  />

                  <label htmlFor="contentUrl">Content URL:</label>
                  <input
                    type="text"
                    id="contentUrl"
                    name="contenturl"
                    value={courseContent.contenturl}
                    onChange={handleCourseChange}
                  />

                  <label htmlFor="uploadDate">Upload Date:</label>
                  <input
                    type="date"
                    id="uploadDate"
                    name="uploadedDate"
                    value={courseContent.uploadedDate}
                    onChange={handleCourseChange}
                  />

                  <button type="submit" className="add-new-content-button">
                    Add Content
                  </button>
                </form>
              )}

              {/* ... (unchanged) */}
            </div>
          )}

          {/* New Course Button */}
          <button onClick={handleNewCourseClick} className="new-course-button">
            New Course
          </button>

          {/* New Course Form */}
          {!selectedCourse && (
            <div className="new-course-form">
              <h2>{selectedCourse ? "Edit Course" : "New Course"}</h2>
              <form>
                <label htmlFor="courseName">Course Name:</label>
                <input
                  type="text"
                  id="courseName"
                  name="coursename"
                  value={newCourse.coursename}
                  onChange={handleNewCourseChange}
                />

                <label htmlFor="courseDescription">Course Description:</label>
                <input
                  type="text"
                  id="courseDescription"
                  name="coursedescription"
                  value={newCourse.coursedescription}
                  onChange={handleNewCourseChange}
                />

                {/* <label htmlFor="uploadedBy">Uploaded By:</label>
                <input
                  type="text"
                  id="uploadedBy"
                  name="uploadedByUser"
                  value={newCourse.uploadedByUser.userid}
                  onChange={handleNewCourseChange}
                /> */}

                <label htmlFor="uploadDate">Upload Date:</label>
                <input
                  type="date"
                  id="uploadDate"
                  name="uploadedDate"
                  value={newCourse.uploadedDate}
                  onChange={handleNewCourseChange}
                />

                <button
                  onClick={handleNewCourseSubmit}
                  className="add-new-course-button"
                >
                  Add Course
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default AdminCourse;
