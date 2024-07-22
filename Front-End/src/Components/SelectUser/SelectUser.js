import { Link } from "react-router-dom";
import "./SelectUser.css";

function SelectUser() {
  return (
    <div className="select-user">
      <div className="background-image"></div>
      <div className="select-user-card">
        <div className="card-inner">
          <div className="card-front">
            <p>Welcome to Torry Harris!</p>
          </div>
          <div className="card-back">
            <p>Select Login Type</p>
            <div className="buttons-container">
              <Link to="/admin-login">
                <button className="userbutton">Admin</button>
              </Link>
              <Link to="/candidate-login">
                <button className="userbutton">Candidate</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectUser;
