import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../Config";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminAssessment.css";
import { useUser } from "../../../UserContext";
import { useNavigate } from "react-router-dom";


const AdminAssessment = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  const [render,setRender]=useState(false);
  const [edit,setEdit]=useState(false);
  const [editedIndex,setEditedIndex]=useState(null);
  const [question1,setQuestion1]=useState(null)
  const handleEdit=(event,index)=>{
    setQuestion1(event);
    setEditedIndex(index)
    setEdit(true);
  }
  const saveEdit=async(questionId)=>{
    try{
      const response=await axios.put(`${API_BASE_URL}/assessment-question/${questionId}`,question1);
    if(response.status === 200){
      setEditedIndex(null);
      handleViewQuestionsClick(question1.assessment)
    }
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    // If the user is not authenticated, navigate to the login page
    if (!userDetails) {
      navigate("/admin-login");
    }
    if (userDetails && userDetails.usertype !== "admin") {
      navigate("/admin-login");
    }
  }, [userDetails, navigate]);
  useEffect(() => {
    loadAssessments();
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tag`);
      setTags(response.data);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const [courseDetailsList, setCourseDetailsList] = useState([]);
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

  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const [newAssessment, setNewAssessment] = useState({
    course: {
      courseid: "",
    },
    assessmentTitle: "",
    maximumMarks: "",
    passingMarks: "",
    time: "",
  });
  const handleDeleteQuestionClick = async (question) => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/assessment-question/${question.questionId}`);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.questionId !== question.questionId)
        );
        console.log(
          "Question with id " + question.questionId + " deleted successfully"
        );
      } catch (error) {
        alert("This question is already mapped");
        console.error("Error deleting question:", error);
      }
    }
  };
  
  const handleDeleteAssessmentClick = async (assessment) => {
    const confirmed = window.confirm("Are you sure you want to delete this assessment?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/assessment/${assessment.assessmentid}`);
        loadAssessments();
        setSelectedAssessment(null);
        setShowQuestionsForm(false);
        setShowQuestionsView(false);
      } catch (error) {
        alert("The assessment is already mapped");
        console.error("Error deleting assessment:", error);
      }
    }
  };
  

  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [showQuestionsView, setShowQuestionsView] = useState(false);

  const loadAssessments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessment`);
      setAssessments(response.data);
    } catch (error) {
      console.error("Error loading assessments:", error);
    }
  };

  const handleEnableDisableClick = async (assessmentId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/assessment/${assessmentId}`,
        {
          status: newStatus,
        }
      );
      console.log(response.data); // Log the response for debugging
      loadAssessments(); // Reload assessments after updating the status
    } catch (error) {
      console.error("Error updating assessment status:", error);
    }
  };

  const handleAssessmentChange = (event) => {
    setNewAssessment({
      ...newAssessment,
      [event.target.name]:
        event.target.name === "course"
          ? { ...newAssessment.course, courseid: event.target.value }
          : event.target.value,
    });
  };

  const handleNewAssessmentSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/assessment`,
        newAssessment
      );
      setAssessments([...assessments, response.data]);
      loadAssessments(); // Load assessments after adding the new one
      setNewAssessment({
        course: {
          courseid: "",
        },
        assessmentTitle: "",
        maximumMarks: "",
        passingMarks: "",
      });
      setSelectedAssessment(null);
      setShowQuestionsForm(false);
      setShowQuestionsView(false);
      loadAssessments();
      loadTags();
    } catch (error) {
      console.error("Error submitting new assessment:", error);
    }
    loadAssessments();
    loadTags();
  };

  const handleNewAssessmentClick = () => {
    setSelectedAssessment(null);
    setShowQuestionsForm(!showQuestionsForm);
    setShowQuestionsView(false);
  };

  const handleAddQuestionsClick = (assessment) => {
    setSelectedAssessment(assessment);
    setShowQuestionsForm(true);
    setShowQuestionsView(false);
  };

  // Tags

  const [tags, setTags] = useState([]);
  const [tagId, setTagId] = useState("");
  const [tagName, setTagName] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [existingTags, setExistingTags] = useState([]);

  const handleManageTagsClick = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tag`);
      setExistingTags(response.data);
      setShowTags(!showTags); // Toggle the showTags state
    } catch (error) {
      console.error("Error loading tags:", error);
    }
    loadAssessments();
    loadTags();
  };

  const handleAddTag = async () => {
    if (tagId && tagName) {
      try {
        // Parse the tagId to an integer
        const parsedTagId = parseInt(tagId);

        const newTag = { tagid: parsedTagId, tagname: tagName }; // Update the property names to match your backend
        await axios.post(`${API_BASE_URL}/tag`, newTag);

        // After adding the tag, fetch the updated list of tags
        const response = await axios.get(`${API_BASE_URL}/tag`);
        setTags(response.data);

        setTagId("");
        setTagName("");
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
    loadAssessments();
    loadTags();
  };

  const handleDeleteTag = async (tagId) => {
    const confirmed = window.confirm("Are you sure you want to delete this tag?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/tag/${tagId}`);
        axios.get(`${API_BASE_URL}/tag`).then((response) => {
          setTags(response.data); // Update the tags state
        });
        loadAssessments();
        loadTags();
      } catch (error) {
        alert("This tag is already mapped");
        console.error("Error deleting tag:", error);
      }
    }
  };
  

  const [newQuestion, setNewQuestion] = useState({
    assessment: { assessmentid: "" },
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    tag: { tagid: "" },
  });
  const handleNewQuestionChange = (event) => {
    setNewQuestion({
      ...newQuestion,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddQuestionSubmit = async (event) => {
    event.preventDefault();

    if (selectedAssessment) {
      // Check if the number of questions for the selectedAssessment has reached its maximumMarks
      if (questions.length >= selectedAssessment.maximumMarks) {
        alert("Cannot add more questions. Maximum questions reached.");
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/assessment-question`,
          {
            assessment: { assessmentid: selectedAssessment.assessmentid },
            questionText: newQuestion.questionText,
            optionA: newQuestion.optionA,
            optionB: newQuestion.optionB,
            optionC: newQuestion.optionC,
            optionD: newQuestion.optionD,
            correctAnswer: newQuestion.correctAnswer,
            tag: { tagid: newQuestion.tag },
          }
        );

        setQuestions((prevQuestions) => [...prevQuestions, response.data]);

        setNewQuestion({
          assessment: { assessmentid: "" },
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          tag: { tagid: "" },
        });

        setSelectedAssessment(response.data);
        loadAssessments();
        loadTags();
      } catch (error) {
        console.error("Error adding question:", error);
      }

      loadAssessments();
      loadTags();
    }
  };
  

  const [questions, setQuestions] = useState([]);

  const handleViewQuestionsClick = async (assessment) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/assessment-question/byAssessment/${assessment.assessmentid}`
      );
      console.log("Response Data:", response.data); // Log the response data
      setQuestions(response.data);
      setSelectedAssessment(assessment);
      setShowQuestionsForm(false);
      setShowQuestionsView(true);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
    loadAssessments();
    loadTags();
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
      <div className="assessment-main">
        <div className="assessment-management-container">
          <h1 className="page-title">Assessment Management</h1>
          {/* Assessments Table */}
          <table className="assessments-table">
            <thead>
              <tr>
                <th>Course Name</th>
                {/* <th>Course ID</th> */}
                <th>Assessment Title</th>
                <th>Max Marks</th>
                <th>Pass Mark</th>
                <th>Time (in minutes)</th>
                <th>Add Questions</th>
                <th>View Questions</th>
                <th>Delete Assessment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment, index) => (
                <tr key={index} className="assessment-row">
                  <td>{assessment?.course?.coursename}</td>
                  {/* <td>{assessment?.course?.courseid}</td> */}
                  <td>{assessment.assessmentTitle}</td>
                  <td>{assessment.maximumMarks}</td>
                  <td>{assessment.passingMarks}</td>
                  <td>{assessment.time}</td>
                  <td>
                    <button
                      className="add-questions-table-button"
                      onClick={() => handleAddQuestionsClick(assessment)}
                    >
                      Add Questions
                    </button>
                  </td>
                  <td>
                    <button
                      className="view-questions-table-button"
                      onClick={() => handleViewQuestionsClick(assessment)}
                    >
                      View Question
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-assessment-table-button"
                      onClick={() => handleDeleteAssessmentClick(assessment)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <div className="toggle-switch">
                      <input
                        className="toggle-input"
                        id={`toggle-${assessment.assessmentid}`}
                        type="checkbox"
                        checked={assessment.status === "enabled"}
                        onChange={() =>
                          handleEnableDisableClick(
                            assessment.assessmentid,
                            assessment.status === "enabled"
                              ? "disabled"
                              : "enabled"
                          )
                        }
                      />
                      <label
                        className="toggle-label"
                        htmlFor={`toggle-${assessment.assessmentid}`}
                      ></label>
                    </div>
                    <p>
                      {assessment.status === "enabled" ? "Enabled" : "Disabled"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          <div className="action-buttons">
            <button
              onClick={handleNewAssessmentClick}
              className="new-assessment-button"
            >
              New Assessment
            </button>
            <button
              onClick={() => {
                handleManageTagsClick();
                setShowTags(!showTags);
              }}
              className="manage-tags-button"
            >
              Manage Tags
            </button>
          </div>
          {!selectedAssessment && showQuestionsForm && (
            <div
              className={`new-assessment-form ${
                showQuestionsForm ? "show" : "hide"
              }`}
            >
              <h2>
                {selectedAssessment ? "Edit Assessment" : "New Assessment"}
              </h2>
              <form
                className="newassessmentform"
                onSubmit={handleNewAssessmentSubmit}
              >
                <label htmlFor="courseName">Course ID:</label>
                <select
                  id="courseid"
                  name="course"
                  value={newAssessment.course.courseid}
                  onChange={handleAssessmentChange}
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courseDetailsList.map((course) => (
                    <option key={course.courseid} value={course.courseid}>
                      {course.coursename}
                    </option>
                  ))}
                </select>

                <label htmlFor="assessmentTitle">Assessment Title:</label>
                <input
                  type="text"
                  id="assessmentTitle"
                  name="assessmentTitle"
                  value={newAssessment.assessmentTitle}
                  onChange={handleAssessmentChange}
                />

                <label htmlFor="maxMarks">Max Marks:</label>
                <input
                  type="text"
                  id="maxMarks"
                  name="maximumMarks"
                  value={newAssessment.maximumMarks}
                  onChange={handleAssessmentChange}
                />

                <label htmlFor="passMark">Pass Mark:</label>
                <input
                  type="text"
                  id="passMark"
                  name="passingMarks"
                  value={newAssessment.passingMarks}
                  onChange={handleAssessmentChange}
                />
                <label htmlFor="time">Time (in minutes):</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={newAssessment.time}
                  onChange={handleAssessmentChange}
                />

                <button className="add-new-course-button" type="submit">
                  Save Assessment
                </button>
              </form>
            </div>
          )}
          {/* Manage Tags Section */}
          {showTags && (
            <div className="manage-tags-section">
              <div className="tag-form">
                <label htmlFor="tagId">Tag ID:</label>
                <input
                  type="text"
                  id="tagId"
                  name="tagid"
                  value={tagId}
                  onChange={(e) => setTagId(e.target.value)}
                />
                <label htmlFor="tagName">Tag Name:</label>
                <input
                  type="text"
                  id="tagName"
                  name="tagname"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                />
                <button
                  type="button"
                  className="add-new-tag-button"
                  onClick={handleAddTag}
                >
                  Add Tag
                </button>
              </div>
              <div className="tag-list">
                <h3>Tag List:</h3>
                <table className="tag-table">
                  <thead>
                    <tr>
                      <th>Tag ID</th>
                      <th>Tag Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => (
                      <tr key={tag.tagid} className="tag-item">
                        <td>{tag.tagid}</td>
                        <td>{tag.tagname}</td>
                        <td>
                          <button
                            className="delete-assessment-table-button"
                            onClick={() => handleDeleteTag(tag.tagid)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Questions Form */}
          {selectedAssessment && showQuestionsForm && (
            <div
              className={`assessment-questions-form ${
                showQuestionsForm ? "show" : "hide"
              }`}
            >
              <h2>{selectedAssessment ? "Edit Questions" : "Add Questions"}</h2>
              <form
                className="addquestionform"
                onSubmit={handleAddQuestionSubmit}
              >
                {/* Question Text */}
                <label htmlFor="assessmentId">Assessment :</label>
                <select
                  id="assessmentId"
                  name="assessment"
                  value={newQuestion.assessment.assessmentid}
                  onChange={handleNewQuestionChange}
                >
                  <option value="" disabled>
                    Select Assessment
                  </option>
                  {assessments.map((assessment) => (
                    <option
                      key={assessment.assessmentid}
                      value={assessment.assessmentid}
                    >
                      {assessment.assessmentTitle}
                    </option>
                  ))}
                </select>

                <label htmlFor="questionText">Question Text:</label>
                <input
                  id="questionText"
                  name="questionText"
                  value={newQuestion.questionText}
                  onChange={handleNewQuestionChange}
                ></input>

                <label htmlFor="optionA">Option A:</label>
                <input
                  type="text"
                  id="optionA"
                  name="optionA"
                  value={newQuestion.optionA}
                  onChange={handleNewQuestionChange}
                />
                <label htmlFor="optionB">Option B:</label>
                <input
                  type="text"
                  id="optionB"
                  name="optionB"
                  value={newQuestion.optionB}
                  onChange={handleNewQuestionChange}
                />

                <label htmlFor="optionC">Option C:</label>
                <input
                  type="text"
                  id="optionC"
                  name="optionC"
                  value={newQuestion.optionC}
                  onChange={handleNewQuestionChange}
                />
                <label htmlFor="optionD">Option D:</label>
                <input
                  type="text"
                  id="optionD"
                  name="optionD"
                  value={newQuestion.optionD}
                  onChange={handleNewQuestionChange}
                />

                {/* Correct Answer */}
                <label htmlFor="correctAnswer">Correct Answer:</label>
                <input
                  type="text"
                  id="correctAnswer"
                  name="correctAnswer"
                  value={newQuestion.correctAnswer}
                  onChange={handleNewQuestionChange}
                />

                {/* Question Tag */}
                <label htmlFor="questionTag">Question Tag:</label>
                <select
                  id="questionTag"
                  name="tag"
                  value={newQuestion.tag.tagid}
                  onChange={handleNewQuestionChange}
                >
                  <option value="" disabled>
                    Select Tag Name
                  </option>
                  {tags.map((tag) => (
                    <option key={tag.tagid} value={tag.tagid}>
                      {tag.tagname}
                    </option>
                  ))}
                </select>

                {/* Add Question Button */}
                <button className="add-new-course-button" type="submit">
                  Add Question
                </button>
              </form>
            </div>
          )}
          {/* Questions View */}

          {selectedAssessment && showQuestionsView && (
            <div
              className={`questions-view ${
                showQuestionsView ? "show" : "hide"
              }`}
            >
              <h2>View Questions</h2>
              <div className="questions-list">
                <h3>Assessment Name: {selectedAssessment.assessmentTitle}</h3>
                    {questions.map((question, index) => (
              <div key={index} className="question-view">
                {editedIndex === index ? (
              <>
                <h3>Edit Question {index + 1}</h3>
                <div className="edit-question-form">
                <p className="key">Question</p>
                <input placeholder="question" value={question1.questionText} onChange={(e)=>setQuestion1((prev)=>({...prev,questionText:e.target.value}))}/>
                <p>Options:</p>
                <p>A: </p>
              <input placeholder="optionA" value={question1.optionA} onChange={(e)=>setQuestion1((prev)=>({...prev,optionA:e.target.value}))}/>
              <p>B: </p>
              <input placeholder="optionB" value={question1.optionB} onChange={(e)=>setQuestion1((prev)=>({...prev,optionB:e.target.value}))}/>
              <p>C: </p>
              <input placeholder="optionC" value={question1.optionC} onChange={(e)=>setQuestion1((prev)=>({...prev,optionC:e.target.value}))}/>
              <p>D: </p>
              <input placeholder="optionD" value={question1.optionD} onChange={(e)=>setQuestion1((prev)=>({...prev,optionD:e.target.value}))}/>
              <p>Correct Answer: </p>
              <input placeholder="correctAnswer" value={question1.correctAnswer} onChange={(e)=>setQuestion1((prev)=>({...prev,correctAnswer:e.target.value}))}/>
              <p>Tag Name: {question.tag?.tagname}</p>
              <div className="edit-question-buttons">
                <button className="save-button" onClick={() => saveEdit(question1.questionId)}>Save</button>
                <button className="cancel-button" onClick={() => setEditedIndex(null)}>Cancel</button>
              </div>
            </div>
            </>
              ) : (
              <>
              <button className="edit-button" onClick={() => handleEdit(question,index)}>
              <svg class="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#a649da" stroke-linecap="round" stroke-width="2"><path d="m20 20h-16"></path><path clip-rule="evenodd" d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z" fill-rule="evenodd"></path></g></svg>
              </button>
        
              <h3>Question {index + 1}</h3>
              <p className="key">{question.questionText}</p>
              <p>Options:</p>
              <p>A: {question.optionA}</p>
              <p>B: {question.optionB}</p>
              <p>C: {question.optionC}</p>
              <p>D: {question.optionD}</p>
              <p>Correct Answer: {question.correctAnswer}</p>
              <p>Tag Name: {question.tag?.tagname}</p>
              <button className="bin-button" onClick={() => handleDeleteQuestionClick(question)}>
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
                  </>
                  )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default AdminAssessment;
