import React, { useEffect, useState } from "react";
import { useUser } from "../../../UserContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./CandidateAssessment.css";
import jsPDF from "jspdf";
import CircularProgressBar from "../CircularProgressBar";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const CandidateAssessment = () => {
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
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [assessmentResultDetails, setAssessmentResultDetails] = useState(null);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [isAssessmentInProgress, setAssessmentInProgress] = useState(false);
  const [obtainedMarksPercentage, setObtainedMarksPercentage] = useState(0); // State variable for percentage of marks obtained
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Add an event listener for beforeunload
    const handleBeforeUnload = (event) => {
      // Display a warning message
      const confirmationMessage =
        "Are you sure you want to leave? Your progress may be lost.";
      event.returnValue = confirmationMessage; // Standard for most browsers
      return confirmationMessage; // For some older browsers
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Timer setup
    let intervalId;

    if (
      selectedAssessment &&
      selectedAssessment.time &&
      isAssessmentInProgress
    ) {
      // Set the initial timer value based on the assessment's timeLimit
      setTimer(selectedAssessment.time * 60); // Convert minutes to seconds

      // Start the timer countdown
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            // Continue counting down
            if (prevTimer === 300) {
              alert("You have 5 minutes left to complete the assessment!");
            } else if (prevTimer === 30) {
              alert("You have 30 seconds left to finish the assessment!");
            }
            return prevTimer - 1;
          } else {
            // Timer reached 00:00, automatically submit assessment
            clearInterval(intervalId);
            handleSubmit(new Event("submit")); // Assuming you have a handleSubmit function
            return 0;
          }
        });
      }, 1000);
    }

    // Cleanup the interval when the component unmounts or assessment changes
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedAssessment, isAssessmentInProgress]);

  useEffect(() => {
    // Calculate percentage of marks obtained
    if (assessmentResultDetails) {
      const percentage =
        (assessmentResultDetails.obtainedMarks /
          assessmentResultDetails.maxMarks) *
        100;
      setObtainedMarksPercentage(percentage);
    }
  }, [assessmentResultDetails]);

  const handleClearResponse = (index) => {
    // Clear the selected option for the corresponding question
    setAssessmentQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].selectedOption = "";
      return updatedQuestions;
    });
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setAssessmentQuestions([]); // Reset questions when closing sidebar
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessment`);

      // Filter assessments based on the "status" column
      const enabledAssessments = response.data.filter(
        (assessment) => assessment.status === "enabled"
      );

      console.log(enabledAssessments);
      setAssessments(enabledAssessments);
    } catch (error) {
      console.error("Error loading assessments:", error);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedAssessment(null);
    setAssessmentResultDetails(null); // Reset assessmentResultDetails
    setAssessmentQuestions([]); // Reset assessmentQuestions
  };

  const handleAssessmentClick = (assessment) => {
    setSelectedAssessment(assessment);
  };
  const takeAssessment = async () => {
    try {
      // Check if the assessment has already been taken
      const userId = userDetails.userid;
      const assessmentId = selectedAssessment.assessmentid;

      const assessmentResultsResponse = await axios.get(
        `${API_BASE_URL}/assessmentResults/${userId}/${assessmentId}`
      );

      const assessmentResults = assessmentResultsResponse.data;

      console.log("Assessment Results:", assessmentResults); // Log the response

      if (assessmentResults) {
        // Assessment has already been taken, handle accordingly
        alert(selectedAssessment.assessmentTitle + " has already been taken");
        console.log("Assessment has already been taken:", assessmentResults);

        // Make an additional API call to get the obtained marks from performance tracking
        const performanceTrackingResponse = await axios.get(
          `${API_BASE_URL}/performancetracking/${userId}/${assessmentId}`
        );

        const performanceTrackingData = performanceTrackingResponse.data;
        const obtainedMarksFromPerformanceTracking =
          performanceTrackingData.marks;

        setAssessmentResultDetails({
          obtainedMarks: obtainedMarksFromPerformanceTracking,
          maxMarks: assessmentResults.assessment.maximumMarks,
          passingMarks: assessmentResults.assessment.passingMarks,
          isPassed: assessmentResults.result,
        });

        // Check if the result is a pass or fail
        if (assessmentResults.result === "pass") {
          console.log("Assessment result: Pass");
          // You can show a message, redirect, or take other actions for a passed assessment
        } else {
          console.log("Assessment result: Fail");
          // You can show a message, redirect, or take other actions for a failed assessment
        }
        setAssessmentSubmitted(true);
        setAssessmentInProgress(false);
      } else {
        // Assessment has not been taken, proceed to load questions

        const confirmationMessage = `Do you want to take the assessment ${selectedAssessment.assessmentTitle} now?\n\nThis assessment has a time limit of ${selectedAssessment.time} minutes.`;

        const confirmation = window.confirm(confirmationMessage);

        if (confirmation) {
          // Proceed to load questions
          const questionsResponse = await axios.get(
            `${API_BASE_URL}/assessment/${assessmentId}/questions`
          );

          console.log("Loading assessment questions:", questionsResponse);
          setAssessmentQuestions(questionsResponse.data);

          // Implement logic for taking the assessment
          console.log("Taking assessment:", selectedAssessment);
          setAssessmentInProgress(true);
          // You can redirect to the assessment page or show a modal for the assessment
        }
      }
    } catch (error) {
      console.error(
        "Error checking assessment results or loading questions:",
        error
      );
    }
  };

  const handleOptionChange = (index, value) => {
    // Update the selected option for the corresponding question
    setAssessmentQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].selectedOption = value;
      return updatedQuestions;
    });
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const isConfirmed = window.confirm("Do you want to submit the assessment?");
    if (isConfirmed) {
      handleSubmit(e); // Pass the event to the handleSubmit function
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = userDetails.userid;
      const assessmentId = selectedAssessment.assessmentid;
      const courseId = selectedAssessment.course.courseid;

      // Loop through each question and send a separate request for each
      for (const question of assessmentQuestions) {
        const response = await axios.post(`${API_BASE_URL}/candidate-results`, {
          user: {
            userid: userId,
          },
          question: {
            questionId: question.questionId,
          },
          assessment: {
            assessmentid: assessmentId,
          },
          candidateAnswer: question.selectedOption || "", // Use the selected option as the candidate's answer
        });

        console.log(
          `Answer for question ${question.questionId} submitted:`,
          response.data
        );
      }

      const totalQuestions = assessmentQuestions.length;
      const correctAnswers = assessmentQuestions.filter(
        (question) => question.selectedOption === question.correctAnswer
      );

      const obtainedMarks = correctAnswers.length;
      const maxMarks = selectedAssessment.maximumMarks;
      const passingMarks = selectedAssessment.passingMarks;

      const isPassed = obtainedMarks >= passingMarks;

      const results = {
        obtainedMarks: obtainedMarks,
        totalQuestions: totalQuestions,
        maxMarks: maxMarks,
        passingMarks: passingMarks,
        isPassed: isPassed,
      };

      console.log("Assessment Results:", results);

      const response = await axios.post(`${API_BASE_URL}/assessmentResults`, {
        assessment: {
          assessmentid: assessmentId,
        },
        user: {
          userid: userId,
        },
        result: isPassed ? "pass" : "fail",
      });

      const performanceTracking = await axios.post(
        `${API_BASE_URL}/performancetracking`,
        {
          assessment: {
            assessmentid: assessmentId,
          },
          user: {
            userid: userId,
          },
          course: {
            courseid: courseId,
          },
          marks: obtainedMarks, // Change this based on your result logic
        }
      );

      console.log("Assessment Result stored in the database:", response.data);
      alert("Assessment submitted successfully");
      setAssessmentSubmitted(true);
      setAssessmentInProgress(false);
      // You can further handle the results or update the UI as needed.
    } catch (error) {
      console.error("Error processing assessment results:", error);
    }
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    let y = 20; // Initial y position

    const title = `${userDetails.username} ${selectedAssessment.assessmentTitle} response`;
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const centerX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(centerX, 10, title);
    // Loop through each position on the page and add the watermark

    // Loop through each question and add it to the PDF
    assessmentQuestions.forEach((question, index) => {
      const questionText = `${index + 1}. ${question.questionText}`;
      const selectedOption = question.selectedOption || "No answer provided"; // Assuming selectedOption is the user's answer

      doc.text(10, y, questionText);
      y += 10; // Increment y position
      doc.text(10, y, `Selected Option: ${selectedOption}`);
      y += 10; // Increment y position
    });

    // Save the PDF
    doc.save(userDetails.username + " " + selectedAssessment.assessmentTitle);
  };

  return (
    <div className="container">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <div className="candidate-assessment-main">
        <div className="candidate-assessment">
          {!selectedAssessment ? (
            assessments.length > 0 ? (
              // Display list of assessments
              <div className="candidate-assessment-list">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.assessmentid}
                    className="assessment-div"
                    onClick={() => handleAssessmentClick(assessment)}
                  >
                    <div className="assessment-wrapper">
                      <h3 className="card__title">
                        {assessment.assessmentTitle}
                      </h3>
                      <p className="card__content">
                        Maximum Marks: {assessment.maximumMarks}
                      </p>
                      <div className="card__date">
                        Passing Marks: {assessment.passingMarks}
                      </div>
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
                ))}
              </div>
            ) : (
              // No assessments available
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
                      <h2>No Assessment found at the moment.</h2>
                      <p class="">
                        Check back later for updates or explore other options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            // Display details of the selected assessment
            <div className="assessment-details">
              <button
                onClick={handleBackButtonClick}
                className="back-button"
                disabled={isAssessmentInProgress}
              >
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
              <h2>{selectedAssessment.assessmentTitle} Assessment Details</h2>
              <p>Maximum Marks: {selectedAssessment.maximumMarks}</p>
              <p>Passing Marks: {selectedAssessment.passingMarks}</p>
              {/* Add more details as needed */}

              <button
                onClick={takeAssessment}
                className="take-assessment-button"
                disabled={isAssessmentInProgress}
              >
                Take Assessment
              </button>

              {assessmentResultDetails && (
                // Display assessment result details if available
                <div className="assessment-result">
                  <h3>Assessment Result:</h3>
                  <p style={{ textTransform: "uppercase" }}>
                    {assessmentResultDetails.isPassed === "pass"
                      ? "You have cleared the assessment ✅"
                      : "Assessment not cleared❌"}
                  </p>

                  {/* Display Circular Progress Bar for Percentage of Marks Obtained */}
                  <div className="progress-bar">
                    <h3>Percentage of Marks Obtained:</h3>
                    <CircularProgressBar percentage={obtainedMarksPercentage} />
                  </div>
                </div>
              )}

              {assessmentQuestions.length > 0 && !assessmentSubmitted && (
                <form className="assessment-form">
                  {selectedAssessment.time && (
                    <div className="timer">
                      <h3>Time Remaining:</h3>
                      <p className={timer < 30 ? "running-out" : ""}>
                        {formatTime(timer)}
                      </p>
                    </div>
                  )}

                  <div className="assessment-questions">
                    <h3>Assessment Questions:</h3>
                    {assessmentQuestions.map((question, index) => (
                      <div key={question.questionId}>
                        <p className="question">
                          {" "}
                          {`${index + 1}. ${question.questionText}`}
                        </p>
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={question.optionA} // Set value to Option A
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            checked={
                              question.selectedOption === question.optionA
                            }
                          />
                          Option A: {question.optionA}
                        </label>
                        <br />
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={question.optionB} // Set value to Option B
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            checked={
                              question.selectedOption === question.optionB
                            }
                          />
                          Option B: {question.optionB}
                        </label>
                        <br />
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={question.optionC} // Set value to Option C
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            checked={
                              question.selectedOption === question.optionC
                            }
                          />
                          Option C: {question.optionC}
                        </label>
                        <br />
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={question.optionD} // Set value to Option D
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            checked={
                              question.selectedOption === question.optionD
                            }
                          />
                          Option D: {question.optionD}
                        </label>
                        <button
                          type="button"
                          className="clearoption"
                          onClick={() => handleClearResponse(index)}
                        >
                          Clear Response
                        </button>
                        <br />
                      </div>
                    ))}
                  </div>
                  <button
                    className="submit-button"
                    type="button"
                    onClick={(e) => handleConfirmSubmit(e)}
                  >
                    Submit Assessment
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        isAssessmentInProgress={isAssessmentInProgress}
      />
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default CandidateAssessment;
