import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../UserContext";
import ReactPlayer from "react-player";
import Quill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./CandidateCourse.css";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

import '@blueprintjs/core/lib/css/blueprint.css'; 
import ProgressBar from "./ProgressBar";

const CandidateCourse = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const { userDetails } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    // If the user is not authenticated, navigate to the login page
    if (!userDetails) {
      navigate("/candidate-login");
    }
    if (userDetails && userDetails.usertype !== "candidate") {
      navigate("/admin-login");
    }
  }, [userDetails, navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [courseStatus, setCourseStatus] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [videourl, setVideourl] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const fetchCourseStatus = async () => {
      try {
        const userId = userDetails.userid;

        // Fetch all course IDs
        const allCourseResponse = await axios.get(`${API_BASE_URL}/course`);
        const allCourseIds = allCourseResponse.data.map(
          (course) => course.courseid
        );
        console.log("all course id", allCourseIds);

        // Fetch status for each course ID
        const statusPromises = allCourseIds.map(async (courseid) => {
          const courseResultResponse = await axios.get(
            `${API_BASE_URL}/course-status/${userId}/${courseid}`
          );
          console.log("RESPONSE", courseResultResponse);
          return courseResultResponse.data;
        });

        axios.get(`${API_BASE_URL}/video/duration/${userDetails.userid}`).then((data) => setVideoData(data.data)).error(err => console.log(err));
        console.log("--------------------------------------");
        // Wait for all promises to resolve
        const fetchedCourseStatus = await Promise.all(statusPromises);
        setCourseStatus(fetchedCourseStatus);
        console.log("STATUS", fetchedCourseStatus);
        // console.log("COURSE STATUS", fetchCourseStatus);
      } catch (error) {
        console.error("Error fetching course status:", error);
      }
    };

    fetchCourseStatus();
  }, [userDetails]);

  const markAsCompleted = async () => {
    if (selectedCourseId && userDetails) {
      const courseStatusData = {
        user: {
          userid: userDetails.userid,
        },
        course: {
          courseid: selectedCourseId,
        },
        status: "completed",
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/course-status`,
          courseStatusData
        );
        setIsCompleted(true);
        alert("You have marked this course as completed.");
        console.log("Course marked as completed:", response.data);

        // You may want to perform additional actions after marking as completed, such as updating the UI
      } catch (error) {
        console.error("Error marking course as completed:", error);
      }
    } else {
      console.error("Selected course or user details not available");
    }
    loadCourseContent();
    loadCourses();
  };

  const getSelectedCourseName = () => {
    const selectedCourse = courses.find(
      (course) => course.courseid === selectedCourseId
    );
    return selectedCourse ? selectedCourse.coursename : "";
  };

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course`);
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadCourseContent = async (courseId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/coursecontent/byCourse/${courseId}`
      );
      setCourseContent(response.data);
      setSelectedContentType(null); // Reset selected content type
    } catch (error) {
      console.error("Error loading course content:", error);
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedCourseId(null); // Reset selected course when closing sidebar
    setSelectedContentType(null); // Reset selected content type
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    loadCourseContent(courseId);
  };

  const handleBackButtonClick = () => {
    console.log({
      "userid": userDetails.userid,
      "url": videourl,
      "duration" : Math.ceil((currentTime / duration) * 100),
      currentTime,
      duration
    })

    axios.put(`${API_BASE_URL}/video/update`,{
      "userid": userDetails.userid,
      "url": videourl,
      "duration" : Math.ceil((currentTime / duration) * 100)
    });
    setSelectedCourseId(null);
    loadCourses();
  };

  const handleContentTypeClick = (contentType) => {
    setSelectedContentType(contentType);
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const downloadNotes = () => {
    // Replace "quill" with the actual ID or class name of your Quill editor container
    const quill = document.querySelector(".quill .ql-editor");

    if (quill) {
      // Get the HTML content of the Quill editor
      const notesContent = quill.innerHTML;

      // Remove HTML tags from the content
      const plainTextContent = stripHtmlTags(notesContent);

      // Create a blob with the plain text content
      const blob = new Blob([plainTextContent], { type: "text/plain" });

      // Specify the file name with extension
      const fileName = "notes.txt";

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger a click on the link to start the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the object URL to free up resources
      window.URL.revokeObjectURL(link.href);
    } else {
      console.error("Quill editor container not found");
    }
  };

  const isCourseCompleted = (courseId) => {
    const status = courseStatus.find(
      (status) => status.course?.courseid === courseId
    );
    return status && status.status === "completed";
  };

  // Callback function to handle video progress updates
  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    console.log(currentTime);
    console.log(videourl);

  };
  const [duration, setDuration] = useState(null);

  // Callback function to handle video duration update
  const handleDuration = (duration) => {
    setDuration(duration);
    console.log(duration);
    console.log(userDetails);
    // setVideourl(content.contenturl);
    console.log(videourl);
  };

  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />

      <div className="candiate-course-main">
        <div className="candidate-course">
          {courses.length === 0 ? (
            <div class="notifications-container">
              <div class="info">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="info-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="info-prompt-wrap">
                    <h2>No courses found at the moment.</h2>
                    <p class="">
                      Check back later for updates or explore other options.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedCourseId ? (
            // Display course content for the selected cours
            <div className="content-container">
              {/* Back button, heading, and content types */}
              <div className="header-container">
                <button onClick={handleBackButtonClick} className="back-button">
                  <svg
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewBox="0 0 1024 1024"
                  >
                    <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                  </svg>
                  <span>Back</span>
                </button>
                <h2>Course Content for {getSelectedCourseName()}</h2>
                <button
                  className="mark-as-completed-button"
                  onClick={() => markAsCompleted(selectedCourseId)}
                  disabled={isCourseCompleted(selectedCourseId) || isCompleted}
                >
                  Mark as Completed ✅
                </button>

                <div>
                  <h3>Content Types:</h3>
                  <button
                    className={`content-type-button ${
                      selectedContentType === "video" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleContentTypeClick("video");
                      setButtonClicked(true);
                    }}
                  >
                    Videos
                  </button>
                  <button
                    className={`content-type-button ${
                      selectedContentType === "document" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleContentTypeClick("document");
                      setButtonClicked(true);
                    }}
                  >
                    Documents
                  </button>
                </div>
              </div>

              {/* Video player or document display */}
              {/* Video player or document display */}
              <div className="media-container">
                {selectedContentType === "video" &&
                courseContent.filter(
                  (content) => content.contenttype === "video"
                ).length > 0
                  ? // Display video player for video content
                    courseContent.map(
                      (content) =>
                        content.contenttype === "video" && (
                          <div key={content.contentid} onClick={()=>{setVideourl(content.contenturl)}}>
                            <ProgressBar bgcolor={`blue`} completed={videoData[content.contenturl]}/>
                            <ReactPlayer
                              url={content.contenturl}
                              controls
                              config={{
                                file: {
                                  attributes: {
                                    controlsList: "nodownload", // Disable download button
                                  },
                                },
                              }}
                              onProgress={handleProgress}
                              onDuration={handleDuration}
                            />
                            {/* Notes section */}
                            <div className="notes-section">
                              <h3>Notes</h3>
                              <Quill
                                className="quill"
                                theme="snow"
                                placeholder="Take notes here..."
                                modules={{
                                  toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ["bold", "italic"],
                                    [
                                      "link",
                                      "image",
                                      "blockquote",
                                      "code-block",
                                    ],
                                  ],
                                }}
                                // Add any necessary event handlers or state for managing notes
                              />
                              <button
                                class="download-btn"
                                onClick={downloadNotes}
                              >
                                <svg
                                  class="svgIcon"
                                  viewBox="0 0 384 512"
                                  height="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                                </svg>
                                <span class="icon2"></span>
                                <span class="tooltip">Download</span>
                              </button>
                            </div>
                          </div>
                        )
                    )
                  : selectedContentType === "document" &&
                    courseContent.filter(
                      (content) => content.contenttype === "document"
                    ).length > 0
                  ? // Display document using iframe
                    courseContent.map(
                      (content) =>
                        content.contenttype === "document" && (
                          <div className="documentdiv" key={content.contentid}>
                            <iframe
                              src={content.contenturl}
                              title="Document Viewer"
                              width="100%"
                              height="500px"
                            ></iframe>
                          </div>
                        )
                    )
                  : buttonClicked && (
                      <div class="info_content">
                        <div class="info__icon">
                          <svg
                            fill="none"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="m12 1.5c-5.79844 0-10.5 4.70156-10.5 10.5 0 5.7984 4.70156 10.5 10.5 10.5 5.7984 0 10.5-4.7016 10.5-10.5 0-5.79844-4.7016-10.5-10.5-10.5zm.75 15.5625c0 .1031-.0844.1875-.1875.1875h-1.125c-.1031 0-.1875-.0844-.1875-.1875v-6.375c0-.1031.0844-.1875.1875-.1875h1.125c.1031 0 .1875.0844.1875.1875zm-.75-8.0625c-.2944-.00601-.5747-.12718-.7808-.3375-.206-.21032-.3215-.49305-.3215-.7875s.1155-.57718.3215-.7875c.2061-.21032.4864-.33149.7808-.3375.2944.00601.5747.12718.7808.3375.206.21032.3215.49305.3215.7875s-.1155.57718-.3215.7875c-.2061.21032-.4864.33149-.7808.3375z"
                              fill="#393a37"
                            ></path>
                          </svg>
                        </div>
                        <div class="info__title">
                          {selectedContentType === "video"
                            ? "No videos available."
                            : selectedContentType === "document"
                            ? "No documents available."
                            : "Check for Videos and Documents"}
                        </div>
                      </div>
                    )}
              </div>
            </div>
          ) : (
            // Map over the courses and create a card for each
            courses.map((course) => (
              <div
                key={course.courseid}
                className="course-div"
                onClick={() => handleCourseClick(course.courseid)}
              >
                <div className="course-wrapper">
                  <h3 className="card__title">{course.coursename}</h3>
                  <p className="card__content">{course.coursedescription}</p>
                  <div className="card__date">{course.uploadedDate}</div>
                  <div className="card__arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      height="15"
                      width="15"
                    >
                      <path
                        fill="#fff"
                        d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default CandidateCourse;
