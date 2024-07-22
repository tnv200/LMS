import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../../UserContext";
import "./CandidateLogin.css";
import { API_BASE_URL } from "../../../Config";

function CandidateLogin() {
  const { setUserData } = useUser();
  const [showLoginBox, setShowLoginBox] = useState(true);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showWrongEmail, setShowWrongEmail] = useState(false);
  

  const [user, setUser] = useState({
    emailid: "",
    // other user properties
  });

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/otp/${user.emailid}`
      );

      console.log(response.data); // Log success message
      alert("Otp sent to " + user.emailid + " successfully");

      // Handle success, e.g., show a success message or navigate
    } catch (axiosError) {
      // Handle errors
      if (axiosError.response) {
        console.error(
          "Server responded with an error:",
          axiosError.response.data
        );
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Error setting up the request:", axiosError.message);
      }

      // Set an error state or show an error message
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/verifyOtp/${user.emailid}`,
        { otp: user.otp }
      );

      console.log(response.data); // Log success message
      alert("New password sent to " + user.emailid + " successfully");

      // Handle success, e.g., show a success message or navigate
    } catch (axiosError) {
      // Handle errors
      if (axiosError.response) {
        console.error(
          "Server responded with an error:",
          axiosError.response.data
        );
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Error setting up the request:", axiosError.message);
      }
      alert("Invalid OTP entered. Please try again.");
      // Set an error state or show an error message
    }
  };

  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/candidate/login`, {
        emailid: user.emailid,
        password: user.password, // Assuming you have 'password' in your state
      });

      if (response.status === 200) {
        const userDetailsResponse = await axios.get(
          `${API_BASE_URL}/user/${user.emailid}`
        );

        // Set user details in the context
        setUserData(userDetailsResponse.data);

        console.log(response.data); // Log success message
        console.log(userDetailsResponse.data); // Lo
        navigate("/candidate-dashboard"); // Use navigate to redirect
      } else {
        // failed
        setLoginErrorMessage(
          response.data ||
            "An unexpected error occurred. Please try again later."
        );
        setLoginSuccessMessage(""); // Clear any previous success message
      }
    } catch (axiosError) {
      if (axiosError.response && axiosError.response.status === 401) {
        setLoginErrorMessage("Invalid credentials or insufficient privileges");
      } else {
        console.error(axiosError); // Log the error for debugging
        setLoginErrorMessage(
          "An error occurred while attempting to log in. Please check your internet connection and try again."
        );
      }
      setLoginSuccessMessage(""); // Clear any previous success message
    }
  };

  const toggleForgotBox = () => {
    setShowLoginBox(!showLoginBox);
    setShowOtpField(false);
    setShowWrongEmail(false);
  };

  const showOtpFieldAfterDelay = () => {
    setTimeout(() => {
      setShowOtpField(true);
    }, 2000);
  };

  const handleGoBack = () => {
    setShowOtpField(false);
    setShowWrongEmail(false);
  };

  return (
    <div className="">
      {showLoginBox ? (
        <div className="candidate-login-box">
          <p>Candidate Login</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="user-box">
              <input
                required
                name="emailid"
                type="text"
                value={user.emailid}
                onChange={(e) => setUser({ ...user, emailid: e.target.value })}
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                required
                name="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <label>Password</label>
            </div>
            <button type="submit" className="custom-button" id="button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
            </button>
            {loginSuccessMessage && (
              <p id="success-message" style={{ color: "green" }}>
                {loginSuccessMessage}
              </p>
            )}
            {/* Only render error message if it's present */}
            {loginErrorMessage && (
              <p id="error-message" style={{ color: "red" }}>
                {loginErrorMessage}
              </p>
            )}
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="#" className="a2" onClick={toggleForgotBox}>
              Forgot Password
            </Link>
          </p>
        </div>
      ) : (
        <div className="forgot-box">
          <p>Forgot Password?</p>
          <div>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="user-box">
                <input
                  required="email"
                  name="email"
                  type="text"
                  value={user.emailid}
                  onChange={(e) =>
                    setUser({ ...user, emailid: e.target.value })
                  }
                />
                <label>Email</label>
              </div>
              <button className="custom-button" type="submit">
                Get OTP
              </button>
            </form>
          </div>
          <div>
            <form onSubmit={handleVerifyOtp}>
              <div className="user-box">
                <input
                  required="text"
                  name="otp"
                  type="text"
                  value={user.otp}
                  onChange={(e) => setUser({ ...user, otp: e.target.value })}
                />
                <label>OTP</label>
                <button className="custom-button" type="submit">
                  Verify
                </button>
              </div>
            </form>
          </div>

          <p>
            Remember your password?{" "}
            <Link to="#" onClick={toggleForgotBox} className="a2">
              Cancel
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default CandidateLogin;
