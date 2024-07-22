import "./Sidebar.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  return (
    <div className={sidebarOpen ? "sidebar_responsive" : ""} id="sidebar-admin">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <img src={logo} alt="logo" />
          <h1>Torry Harris</h1>
        </div>
        <i
          onClick={() => closeSidebar()}
          className="fa fa-times"
          id="sidebarIcon"
          aria-hidden="true"
        ></i>
      </div>

      <div className="sidebar__menu">
        <Link to="/admin-dashboard" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-home"></i>
            <a className="a-tag">Dashboard</a>
          </div>
        </Link>

        <Link to="/admin-course" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-book" aria-hidden="true"></i>

            <a className="a-tag">Course Management</a>
          </div>
        </Link>

        <Link to="/admin-assessment" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-list" aria-hidden="true"></i>
            <a className="a-tag">Assessment Management</a>
          </div>
        </Link>

        <Link to="/admin-report" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-tasks" aria-hidden="true"></i>
            <a className="a-tag">Assessment Report</a>
          </div>
        </Link>

        <Link to="/admin-feedback" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-comments" aria-hidden="true"></i>
            <a className="a-tag">Feedback Management</a>
          </div>
        </Link>

        <Link to="/reset-password" style={{ textDecoration: "none" }}>
          <div className="sidebar__link active_menu_link">
            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
            <a className="a-tag">Change Password</a>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
