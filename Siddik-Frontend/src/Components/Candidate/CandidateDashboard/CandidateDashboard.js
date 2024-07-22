import React, { useEffect, useState } from "react";
import hello from "../../../assets/hello.svg";
import { useUser } from "../../../UserContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./CandidateDashboard.css";
import CircularProgressBar from "../CircularProgressBar";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
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
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [courseStatus, setCourseStatus] = useState([]);
  // const [candidateResults, setCandidateResults] = useState([]);
  // const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [tagPercentages, setTagPercentages] = useState(new Map());
  const [tagNames, setTagNames] = useState(new Map());
  const [currentTime, setCurrentTime] = useState(new Date());
  

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const fetchCandidateResults = async () => {
    try {
      const userId = userDetails.userid;
      const response = await axios.get(
        `${API_BASE_URL}/candidate-results/user/${userId}`
      );
      // setCandidateResults(response.data);
      // console.log(response.data);
      return response.data;

      
    } catch (error) {
      console.error("Error fetching candidate results:", error);
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessment-question`);
      // setAssessmentQuestions(response.data);
      console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching assessment questions:", error);
    }
  };

  const calculateUserScores = (candidateResults,assessmentQuestions) => {

    const calculatedTagNames = new Map();
    if(assessmentQuestions.size>=0 ){
      return ;
    }
    assessmentQuestions.forEach((question) => {
      const tagId = question.tag.tagid;
      const tagName = question.tag.tagname; 
      calculatedTagNames.set(tagId, tagName);
    });

    setTagNames(calculatedTagNames);
    console.log("Calculated Tag Names", calculatedTagNames);

    const questionTagMap = new Map();
    assessmentQuestions.forEach((question) => {
      const tagId = question.tag.tagid; 

      if (!questionTagMap.has(tagId)) {
        questionTagMap.set(tagId, []);
      }
      questionTagMap.get(tagId).push(question);
    });

    console.log("questionTagMap:", questionTagMap);

    // Calculate user scores
    const tagScores = new Map();
    
    candidateResults.forEach((result) => {
      const tagId = result.question.tag.tagid; 

      console.log("result:", result);
      console.log("tagId:", tagId);

      const correctAnswers = questionTagMap
        .get(tagId)
        .map((q) => q.correctAnswer); // Get all correct answers for the tag

      // Your scoring logic here
      const userScore = correctAnswers.includes(result.candidateAnswer) ? 1 : 0;

      if (!tagScores.has(tagId)) {
        tagScores.set(tagId, { totalQuestions: 0, userScore: 0 });
      }

      tagScores.get(tagId).totalQuestions += 1;
      tagScores.get(tagId).userScore += userScore;
    });

    console.log("tagScores:", tagScores);

    // Calculate percentages
    const tagPercentages = new Map();
    tagScores.forEach((score, tagId) => {
      const percentage = (score.userScore / score.totalQuestions) * 100;
      tagPercentages.set(tagId, percentage);
    });

    console.log("Tag Percentages:", tagPercentages);
    setTagPercentages(tagPercentages);
    
  };

  const getMessageForPercentage = (percentage) => {
    if (percentage >= 0 && percentage <= 25) {
      return "Need to work hard on this concept!";
    } else if (percentage > 25 && percentage <= 50) {
      return "Making progress, keep it up!";
    } else if (percentage > 50 && percentage <= 75) {
      return "Doing well, you're getting there!";
    } else if (percentage > 75) {
      return "Mastered this concept, great job!";
    } else {
      return "No message available";
    }
  };

  const handleClick = async() => {
    // console.log("clicked1");
    // await fetchCandidateResults();
    // console.log("clicked22");
    // await fetchAssessmentQuestions();

    // Assuming that you have access to candidateResults and assessmentQuestions state
    const candidateResults=await fetchCandidateResults();
    const assessmentQuestions= await fetchAssessmentQuestions();
    console.log(assessmentQuestions,"assessmentQuestions");
    console.log(candidateResults,"candidateResults");
    // if(assessmentQuestions.size>=0 ){
    if(candidateResults==null){
      return ;
    }  
    calculateUserScores(candidateResults,assessmentQuestions);
    // }
  
  };

  useEffect(() => {
    const fetchCourseStatus = async () => {
      try {
        const userId = userDetails.userid;

        // Fetch all course IDs
        const allCourseResponse = await axios.get(`${API_BASE_URL}/course`);
        const allCourseIds = allCourseResponse.data.map(
          (course) => course.courseid
        );
        // console.log("all course id", allCourseIds);

        const statusPromises = allCourseIds.map(async (courseid) => {
          const courseResultResponse = await axios.get(
            `${API_BASE_URL}/course-status/${userId}/${courseid}`
          );
          // console.log("RESPONSE", courseResultResponse);
          return courseResultResponse.data;
        });

        const fetchedCourseStatus = await Promise.all(statusPromises);
        setCourseStatus(fetchedCourseStatus);
        // console.log("STATUS", fetchedCourseStatus);
        // console.log("COURSE STATUS", fetchCourseStatus);
      } catch (error) {
        console.error("Error fetching course status:", error);
      }
    };

    fetchCourseStatus();
  }, [userDetails]);

  useEffect(() => {
    const fetchAssessmentResults = async () => {
      try {
        const userId = userDetails.userid;

       
        const allAssessmentsResponse = await axios.get(
          `${API_BASE_URL}/assessment`
        );

        const allAssessmentIds = allAssessmentsResponse.data.map(
          (assessment) => assessment.assessmentid
        );

        // Fetch results for each assessment ID
        const resultsPromises = allAssessmentIds.map(async (assessmentid) => {
          const assessmentResultsResponse = await axios.get(
            `${API_BASE_URL}/assessmentResults/${userId}/${assessmentid}`
          );
          // console.log(assessmentResultsResponse);
          return assessmentResultsResponse.data;
        });

        const fetchedAssessmentResults = await Promise.all(resultsPromises);
        // console.log("RESULT", fetchedAssessmentResults);
        setAssessmentResults(fetchedAssessmentResults);
      } catch (error) {
        console.error("Error fetching assessment results:", error);
      }
    };

    fetchAssessmentResults();
  }, [userDetails]);
  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <div className="candidate-dashboard-main">
        <div className="main__container">
          {/* <!-- MAIN TITLE STARTS HERE --> */}

          <div className="main__title">
            <img src={hello} alt="hello" />
            <div className="main__greeting">
              <h1>Hello {userDetails?.username || "Guest"}</h1>
              <p>Welcome to your dashboard</p>
              <button className="view-progress-button" onClick={handleClick}>
                View Progress
              </button>
            </div>
            <div className="time-card">
              <p className="time-text">
                <span>{`${hours % 12 || 12}:${
                  minutes < 10 ? "0" : ""
                }${minutes}`}</span>
                <span className="time-sub-text">{period}</span>
              </p>
              <p className="day-text">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                stroke-width="0"
                fill="currentColor"
                stroke="currentColor"
                class="moon"
              >
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
              </svg>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="details-cards">
              <div className="parent">
                <div className="assessment-card">
                  <div className="assessment-header">Completed Assessments</div>
                  <div className="assessment-body">
                    {assessmentResults.some((result) => result !== "") ? (
                      <table className="completed-assessment">
                        <tbody>
                          {assessmentResults
                            .filter((result) => result !== "") // Filter out empty strings
                            .map((result, index) => (
                              <tr key={index}>
                                <td>{result.assessment.assessmentTitle} ✅</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="assessment-msg">
                        {assessmentResults.length === 0
                          ? "You have not completed any assessments"
                          : "No assessment results available"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="course-card">
                  <div className="course-header">Completed courses</div>
                  <div className="course-body">
                    {courseStatus.some((status) => status !== "") ? (
                      <table className="completed-courses">
                        <tbody>
                          {courseStatus
                            .filter((status) => status !== "") // Filter out empty strings
                            .map((status, index) => (
                              <tr key={index}>
                                <td>{status.course.coursename} ✅</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="course-msg">
                        No course completion information available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {tagNames.size > 0 &&             
            <div className="progress-bar">
              <h1>Analysis</h1>
              <div className="analysis-result">
                {Array.from(tagPercentages).map(([tagId, percentage]) => (
                  <div className="progress-div" key={tagId}>
                    <h3>{`${tagNames.get(tagId) || "Unknown"}`}</h3>
                    <CircularProgressBar
                      percentage={Number(percentage.toFixed(0))}
                    />
                    <p>{getMessageForPercentage(percentage)}</p>
                  </div>
                ))}
              </div>
            </div>}

          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default CandidateDashboard;
