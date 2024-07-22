import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../../assets/avatar.svg";
import { useUser } from "../../../UserContext";

const Navbar = ({ sidebarOpen, openSidebar }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showDateTime, setShowDateTime] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleLogout = () => {
    // Clear user details on logout
    setUserData(null);
    // Redirect to the login page
    navigate("/");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();

  return (
    <nav className="navbar">
      <div className="nav_icon" onClick={() => openSidebar()}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>
      <div className="navbar__left">
        <a className="active_link" href="#">
          Candidate
        </a>
      </div>
      <div className="navbar__right">
        <div className="avatar-container">
          <a onClick={() => setShowLogoutPopup(!showLogoutPopup)}>
            <img width="30" src={avatar} alt="avatar" />
          </a>
          {showLogoutPopup && (
            <div className="popup">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
