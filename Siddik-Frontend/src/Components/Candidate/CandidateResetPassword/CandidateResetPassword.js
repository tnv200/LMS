import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./CandidateResetPassword.css";
import { useUser } from "../../../UserContext";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const CandidateResetPassword = () => {
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
  const [resetData, setResetData] = useState({
    email: userDetails?.emailid,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onInputChange = (e) => {
    const value = e.target.value;
    let errorMessage = "";
  
    if (["newPassword", "confirmPassword"].includes(e.target.name)) {
      // Validate minimum length
      if (value.length < 8) {
        errorMessage = "Password must be at least 8 characters long.";
      }
  
      // Validate special characters and numbers
      const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
      const hasSpecialChars = specialChars.test(value);
      const numbers = /\d/;
      const hasNumbers = numbers.test(value);
      const uppercaseLetter = /[A-Z]/;
      const hasUppercaseLetter = uppercaseLetter.test(value);
      if (!hasSpecialChars || !hasNumbers || !hasUppercaseLetter) {
        errorMessage =
        "Password must contain one Uppercase,Number and Special Character";
      }
    }
  
    setResetData({
      ...resetData,
      [e.target.name]: value,
    });
  
    setErrorMessage(errorMessage);
  };
 
  const validatePasswordConstraints = (password) => {
    // Validate minimum length
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  
    // Validate special characters and numbers
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const hasSpecialChars = specialChars.test(password);
    const numbers = /\d/;
    const hasNumbers = numbers.test(password);
    const uppercaseLetter = /[A-Z]/;
    const hasUppercaseLetter = uppercaseLetter.test(password);
    if (!hasSpecialChars || !hasNumbers || !hasUppercaseLetter) {
      return "Password must contain one Uppercase,Number and Special Character";
    }
  
    return ""; // No error message if constraints are met
  };
  

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (resetData.newPassword !== resetData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      setSuccessMessage("");
      return;
    }
  
    // Validate newPassword against constraints
    const newPasswordErrorMessage = validatePasswordConstraints(resetData.newPassword);
    if (newPasswordErrorMessage) {
      setErrorMessage(newPasswordErrorMessage);
      setSuccessMessage("");
      alert("Password does not meet the constraints.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/updatePassword`,
        resetData
      );
  
      if (response.status === 200) {
        setSuccessMessage(response.data);
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage(
          response.data ||
            "An unexpected error occurred. Please try again later."
        );
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (axiosError) {
      if (axiosError.response && axiosError.response.status === 400) {
        setErrorMessage(axiosError.response.data);
      } else {
        console.error(axiosError); // Log the error for debugging
        setErrorMessage(
          "An error occurred while resetting the password. Please check your internet connection and try again."
        );
      }
      setSuccessMessage(""); // Clear any previous success message
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
      <div className="candidate-password-main">
        <div className="body-container">
          <div className="candidate-reset-card">
            <div className="card-header">
              <div className="text-header">Change Password</div>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password:</label>
                  <input
                    required
                    className="form-control"
                    name="currentPassword"
                    id="currentPassword"
                    type="password"
                    value={resetData.currentPassword}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    required
                    className="form-control"
                    name="newPassword"
                    id="newPassword"
                    type="password"
                    value={resetData.newPassword}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input
                    required
                    className="form-control"
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    value={resetData.confirmPassword}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <input type="submit" className="btn" value="Submit" />
                {/* Only render success message if it's present */}
                {successMessage && (
                  <p id="success-reset-message" style={{ color: "green" }}>
                    {successMessage}
                  </p>
                )}
                {/* Only render error message if it's present */}
                {errorMessage && (
                  <p id="error-reset-message" style={{ color: "red" }}>
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default CandidateResetPassword;
