import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext";
import axios from "axios";
import "./AdminLogin.css";
import { API_BASE_URL } from "../../../Config";

function AdminLogin() {
  const { setUserData } = useUser();
  const [showLoginBox, setShowLoginBox] = useState(true);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showWrongEmail, setShowWrongEmail] = useState(false);
  const [showSignupBox, setShowSignupBox] = useState(false);

  const [user, setUser] = useState({
    emailid: "",
    // other user properties
  });

  const [passcode, setPasscode] = useState("");
  const correctPasscode = "admin"; // Your constant passcode

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

      // Set an error state or show an error message
      alert("Invalid OTP entered. Please try again.");
    }
  };

  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        emailid,
        password,
      });

      if (response.status === 200) {
        // Authentication successful, fetch user details
        const userDetailsResponse = await axios.get(
          `${API_BASE_URL}/user/${emailid}`
        );

        // Set user details in the context
        setUserData(userDetailsResponse.data);

        console.log(response.data); // Log success message
        console.log(userDetailsResponse.data); // Log success message
        navigate("/admin-dashboard"); // Use navigate to redirect
      } else {
        //  failed
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

  const [adduser, AddUser] = useState({
    userid: "",
    emailid: "",
    password: "",
    username: "",
  });

  const { userid, emailid, password, username, usertype } = adduser;

  const onInputChange = (e) => {
    AddUser({ ...adduser, [e.target.name]: e.target.value });
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    if (passcode !== correctPasscode) {
      alert("Invalid passcode");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/signup`,
        adduser
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
          "An error occurred while adding the user. Please check your internet connection and try again."
        );
      }
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  const toggleForgotBox = () => {
    setShowLoginBox(!showLoginBox);
    setShowOtpField(false);
    setShowWrongEmail(false);
    setShowSignupBox(false);
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

  const handleSignupClick = () => {
    setShowSignupBox(true);
    setShowLoginBox(false); // Hide the login box when showing the signup box
  };

  return (
    <div className="">
      {showLoginBox ? (
        <div className="login-box">
          <p>Admin Login</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="user-box">
              <input
                required
                name="emailid"
                type="text"
                value={emailid}
                onChange={(e) => onInputChange(e)}
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                required
                name="password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => onInputChange(e)}
              />
              <label htmlFor="password">Password</label>
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
            <a href="#" className="a2" onClick={handleSignupClick}>
              Sign up!
            </a>
            <br />
            Forgot your password?{" "}
            <a href="#" onClick={toggleForgotBox} className="a2">
              Forgot Password
            </a>
          </p>
        </div>
      ) : showSignupBox ? (
        <div className="signup-box">
          <p>Sign Up</p>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="user-box">
              <input
                required="text"
                name="userid"
                value={userid}
                type="text"
                onChange={(e) => onInputChange(e)}
              />
              <label>Employee ID</label>
            </div>
            <div className="user-box">
              <input
                required="text"
                name="username"
                value={username}
                type="text"
                onChange={(e) => onInputChange(e)}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                required="email"
                name="emailid"
                type="text"
                value={emailid}
                onChange={(e) => onInputChange(e)}
              />
              <label>Email ID</label>
            </div>
            <div className="user-box">
              <input
                required="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => onInputChange(e)}
              />
              <label>Password</label>
            </div>
            <div className="user-box">
              <input
                required
                name="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <label>Admin Passcode</label>
            </div>
            {/* <div className="user-checkbox">
              <label className="admin-label">Admin</label>
              <input
                id="check"
                className="check-tick"
                type="checkbox"
                name="usertype"
                value="admin"
                checked={usertype === "admin"}
                onChange={(e) => onInputChange(e)}
              />
            </div> */}

            <button type="submit" className="custom-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Sign Up
            </button>
            {successMessage && (
              <p id="success-message" style={{ color: "green" }}>
                {successMessage}
              </p>
            )}

            {/* Only render error message if it's present */}
            {errorMessage && (
              <p id="error-message" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
          </form>
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => setShowLoginBox(true)} className="a2">
              Login
            </a>
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
            <a href="#" onClick={toggleForgotBox} className="a2">
              Cancel
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
