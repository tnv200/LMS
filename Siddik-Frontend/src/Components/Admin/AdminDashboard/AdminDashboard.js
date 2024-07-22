import React, { useEffect, useState } from "react";
import hello from "../../../assets/hello.svg";
import { useUser } from "../../../UserContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AdminDashboard.css";
import { API_BASE_URL } from "../../../Config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    // If the user is not authenticated, navigate to the login page
    if (!userDetails) {
      navigate("/admin-login");
    }
    if (userDetails && userDetails.usertype !== "admin") {
      navigate("/admin-login");
    }
  }, [userDetails, navigate]);
  console.log(userDetails);

  const [users, SetUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const filteredCandidates = filteredUsers.filter(
    (user) => user.usertype === "candidate"
  );
  const filteredAdmins = filteredUsers.filter(
    (user) => user.usertype === "admin"
  );
  const [deleteuser, DeleteUser] = useState({ userid: "" });
  const { deleteuserid } = deleteuser;
  const onDeleteInputChange = (e) => {
    DeleteUser({ ...deleteuser, [e.target.name]: e.target.value });
  };

  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [errorDeleteMessage, setErrorDeleteMessage] = useState("");

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/delete-user`,
        deleteuser
      );

      console.log("Response from server:", response);

      if (response.status === 200) {
        setSuccessDeleteMessage(response.data);
        setErrorDeleteMessage(""); // Clear any previous error message
        DeleteUser(prevState => ({ ...prevState, userid: "" }));
        loadUsers();
      } else if (response.status === 404) {
        setErrorDeleteMessage(response.data);
        setSuccessDeleteMessage(""); // Clear any previous success message
      } else {
        setErrorDeleteMessage(
          response.data ||
            "An unexpected error occurred. Please try again later."
        );
        setSuccessDeleteMessage(""); // Clear any previous success message
      }
      setTimeout(() => {
        setSuccessDeleteMessage("");
        setErrorDeleteMessage("");
        loadUsers();
      }, 3000);
    } catch (axiosError) {
      console.error("Error from axios:", axiosError);

      if (axiosError.response && axiosError.response.status === 400) {
        setErrorDeleteMessage(axiosError.response.data);
      } else if (axiosError.response && axiosError.response.status === 404) {
        setErrorDeleteMessage(axiosError.response.data);
      } else {
        setErrorDeleteMessage(
          "An error occurred while deleting the user. Please check your internet connection and try again."
        );
      }
      setSuccessDeleteMessage(""); // Clear any previous success message
      setTimeout(() => {
        setSuccessDeleteMessage("");
        setErrorDeleteMessage("");
        loadUsers();
      }, 3000);
    }
  };
  //delete-user form backend functions
  const [accessUser, setAccessUser] = useState({ userid: "" });
  const { userid: accessUserId } = accessUser;

  const onAccessInputChange = (e) => {
    setAccessUser({ ...accessUser, [e.target.name]: e.target.value });
  };

  const [successAccessMessage, setSuccessAccessMessage] = useState("");
  const [errorAccessMessage, setErrorAccessMessage] = useState("");

  const onSubmitAccess = async (e, action) => {
    e.preventDefault();
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmAction) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/${action}-user`,
        accessUser
      );

      if (response.status === 200) {
        setSuccessAccessMessage(response.data);
        setErrorAccessMessage(""); // Clear any previous error message
        setAccessUser(prevState => ({ ...prevState, userid: "" }));
        loadUsers();
      } else if (response.status === 404) {
        setErrorAccessMessage(response.data);
        setSuccessAccessMessage(""); // Clear any previous success message
      } else {
        setErrorAccessMessage(
          response.data ||
            `An unexpected error occurred. Please try again later.`
        );
        setSuccessAccessMessage(""); // Clear any previous success message
      }
      setTimeout(() => {
        setSuccessAccessMessage("");
        setErrorAccessMessage("");
        loadUsers();
      }, 3000);
    } catch (axiosError) {
      console.error("Error from axios:", axiosError);

      if (axiosError.response && axiosError.response.status === 400) {
        setErrorAccessMessage(axiosError.response.data);
      } else if (axiosError.response && axiosError.response.status === 404) {
        setErrorAccessMessage(axiosError.response.data);
      } else {
        setErrorAccessMessage(
          `An error occurred while ${action} the user. Please check your internet connection and try again.`
        );
      }
      setSuccessAccessMessage(""); // Clear any previous success message
      setTimeout(() => {
        setSuccessAccessMessage("");
        setErrorAccessMessage("");
        loadUsers();
      }, 3000);
    }
  };

  const [edituser, setEditUser] = useState({
    userid: "",
    emailid: "",
    username: "",
    usertype: "",
  });

  const { edituserid, editemailid, editpassword, editusername, editusertype } =
    edituser;

  const onEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevEditUser) => ({
      ...prevEditUser,
      [name]: value === "" ? null : value,
    }));
  };

  const [successEditMessage, setSuccessEditMessage] = useState("");
  const [errorEditMessage, setErrorEditMessage] = useState("");

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (edituser.usertype !== users.find((user) => user.userid === edituser.userid)?.usertype) {
      // Confirm user type change with the user
      const confirmUserTypeChange = window.confirm("Changing the user type may have implications. Are you sure?");
      if (!confirmUserTypeChange) {
        return; // Do nothing if the user cancels
      }
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/edit-user`,
        edituser
      );
      console.log("success",edituser)
      console.log("Response from server:", response);
        
      if (response.status === 200) {
        setSuccessEditMessage(response.data);        
        const setUser={
          userid:"",
          emailid:"",
          username:"",
          usertype:"",
        };
        setEditUser(setUser);
        setErrorEditMessage(""); // Clear any previous error message
        loadUsers();
      } else if (response.status === 404) {
        setErrorEditMessage(response.data);
        setSuccessEditMessage(""); // Clear any previous success message
      } else {
        setErrorEditMessage(
          response.data ||
            "An unexpected error occurred. Please try again later."
        );
        setSuccessEditMessage(""); // Clear any previous success message
      }
      setTimeout(() => {
        setSuccessEditMessage("");
        setErrorEditMessage("");
        loadUsers();
      }, 3000);
    } catch (axiosError) {
      console.error("Error from axios:", axiosError);

      if (axiosError.response && axiosError.response.status === 400) {
        setErrorEditMessage(axiosError.response.data);
      } else if (axiosError.response && axiosError.response.status === 404) {
        setErrorEditMessage(axiosError.response.data);
      } else {
        setErrorEditMessage(
          "An error occurred while editing the user. Please check your internet connection and try again."
        );
      }
      setSuccessEditMessage(""); // Clear any previous success message
      setTimeout(() => {
        setSuccessEditMessage("");
        setErrorEditMessage("");
        loadUsers();
      }, 3000);
    }
  };
  //add-user form backend functions

  const [adduser, AddUser] = useState({
    userid: "",
    emailid: "",
    password: "",
    username: "",
    usertype: "",
  });

  const { userid, emailid, password, username, usertype } = adduser;

  const onInputChange = (e) => {
    const value = e.target.value;
    let errorMessage = "";
  
  
    if (e.target.name === "password") {
      if (value.length < 8) {
        errorMessage = "Password must be at least 8 characters long.";
      }
  
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

  
    AddUser({
      ...adduser,
      [e.target.name]: value,
    });
  
    setErrorMessage(errorMessage);
  };
  
  const validatePasswordConstraints = (password) => {

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const hasSpecialChars = specialChars.test(password);
    const numbers = /\d/;
    const hasNumbers = numbers.test(password);
    const uppercaseLetter = /[A-Z]/;
    const hasUppercaseLetter = uppercaseLetter.test(password);
    if (!hasSpecialChars || !hasNumbers || !hasUppercaseLetter) {
      return "Password must contain one Uppercase,Number and Special Character";
    }
  
    return ""; // No error if constraints are met
  };


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const passwordErrorMessage = validatePasswordConstraints(adduser.password);
    if (passwordErrorMessage) {
      setErrorMessage(passwordErrorMessage);
      setSuccessMessage("");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/add-user`,
        adduser
      );

      if (response.status === 200) {
        setSuccessMessage(response.data);
        AddUser({
          userid: "",
          emailid: "",
          password: "",
          username: "",
          usertype: "",
        });
        setErrorMessage(""); // Clear any previous error message
        loadUsers();
      } else {
        setErrorMessage(
          response.data ||
            "An unexpected error occurred. Please try again later."
        );
        setSuccessMessage(""); // Clear any previous success message
      }
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        loadUsers();
      }, 3000);
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
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        loadUsers();
      }, 3000);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get(`${API_BASE_URL}/admin/dashboard`);
    SetUsers(result.data);
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
      <div className="admin-dashboard-main">
        <div className="main__container">
          {/* <!-- MAIN TITLE STARTS HERE --> */}

          <div className="main__title">
            <img src={hello} alt="hello" />
            <div className="main__greeting">
              <h1>Hello {userDetails?.username || "Guest"}</h1>
              <p>Welcome to your admin dashboard</p>
            </div>
          </div>

          {/* <!-- MAIN TITLE ENDS HERE --> */}

          {/* <!-- MAIN CARDS STARTS HERE --> */}
          <div className="main__cards">
            <div className="admin-cards">
              <i
                className="fa fa-users fa-2x text-lightblue"
                aria-hidden="true"
              ></i>
              <div className="card_inner">
                <p className="text-primary-p">Number of Users</p>
                <span className="font-bold text-title">
                  {filteredUsers.length}
                </span>
              </div>
            </div>
            <div className="admin-cards">
              <i
                className="fa fa-graduation-cap fa-2x text-lightblue"
                aria-hidden="true"
              ></i>
              <div className="card_inner">
                <p className="text-primary-p">Number of Candidates</p>
                <span className="font-bold text-title">
                  {filteredCandidates.length}
                </span>
              </div>
            </div>
            <div className="admin-cards">
              <i
                className="fa fa-user-secret fa-2x text-lightblue"
                aria-hidden="true"
              ></i>
              <div className="card_inner">
                <p className="text-primary-p">Number of Admin</p>
                <span className="font-bold text-title">
                  {filteredAdmins.length}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="form-container">
              {/* Form 1 */}

              <div>
                <div className="admin-form add-user-form">
                  <h3>Add User</h3>
                  <form onSubmit={(e) => onSubmit(e)} id="addUserForm">
                    <label htmlFor="addUserId">User ID:</label>
                    <input
                      type="text"
                      id="addUserId"
                      name="userid"
                      value={userid}
                      onChange={(e) => onInputChange(e)}
                    />

                    <label htmlFor="addEmail">Email:</label>
                    <input
                      type="email"
                      id="addEmail"
                      name="emailid"
                      value={emailid}
                      onChange={(e) => onInputChange(e)}
                    />

                    <label htmlFor="addPassword">Password:</label>
                    <input
                      type="password"
                      id="addPassword"
                      name="password"
                      value={password}
                      onChange={(e) => onInputChange(e)}
                    />

                    <label htmlFor="addUsername">Username:</label>
                    <input
                      type="text"
                      id="addUsername"
                      name="username"
                      value={username}
                      onChange={(e) => onInputChange(e)}
                    />

                    <label htmlFor="addUserType">User Type:</label>
                    <select
                      id="addUserType"
                      name="usertype"
                      value={usertype}
                      onChange={(e) => onInputChange(e)}
                    >
                      <option value="">Select User Type</option>
                      <option value="admin">Admin</option>
                      <option value="candidate">Candidate</option>
                    </select>

                    {/* Submit button */}
                    <button id="adduser-button" type="submit">
                      Add User
                    </button>
                    {/* Only render success message if it's present */}
                    {successMessage && (
                      <p id="success-added-message" style={{ color: "green" }}>
                        {successMessage}
                      </p>
                    )}

                    {/* Only render error message if it's present */}
                    {errorMessage && (
                      <p id="error-added-message" style={{ color: "red" }}>
                        {errorMessage}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* Form 2 */}
              <div>
                <div className="admin-form edit-user-form">
                  <h3>Edit User</h3>
                  <form onSubmit={(e) => onSubmitEdit(e)} id="editUserForm">
                    <label htmlFor="editUserId">User ID:</label>
                    <input
                      type="text"
                      id="editUserid"
                      name="userid"
                      value={edituser.userid}
                      onChange={(e) => onEditInputChange(e)}
                    />

                    <label htmlFor="editEmail">Email:</label>
                    <input
                      type="email"
                      id="editEmail"
                      name="emailid"
                      value={edituser.emailid}
                      onChange={(e) => onEditInputChange(e)}
                    />

                    {/* <label htmlFor="editPassword">Password:</label>
                  <input
                    type="password"
                    id="editPassword"
                    name="password"
                    value={edituser.password}
                    onChange={(e) => onEditInputChange(e)}
                  /> */}

                    <label htmlFor="editUsername">Username:</label>
                    <input
                      type="text"
                      id="editUsername"
                      name="username"
                      value={edituser.username}
                      onChange={(e) => onEditInputChange(e)}
                    />

                    <label htmlFor="editUserType">User Type:</label>
                    <select
                      id="editUserType"
                      name="usertype"
                      value={edituser.usertype}
                      onChange={(e) => onEditInputChange(e)}
                    >
                      <option value="">Select User Type</option>
                      <option value="admin">Admin</option>
                      <option value="candidate">Candidate</option>
                    </select>

                    {/* Submit button */}
                    <button id="edituser-button" type="submit">
                      Edit User
                    </button>
                    {successEditMessage && (
                      <p id="success-edited-message" style={{ color: "green" }}>
                        {successEditMessage}
                      </p>
                    )}

                    {/* Only render error message if it's present */}
                    {errorEditMessage && (
                      <p id="error-edited-message" style={{ color: "red" }}>
                        {errorEditMessage}
                      </p>
                    )}
                  </form>
                </div>
              </div>


            <div className="d-forms">             
              <div>
                <div className="admin-form delete-user-form">
                  <h3>Delete User</h3>
                  <form
                    onSubmit={(e) => onSubmitDelete(e)}
                    className="delete-user"
                  >
                    <label htmlFor="deleteUserId">User ID:</label>
                    <input
                      type="text"
                      id="deleteUserId"
                      name="userid"
                      value={deleteuser.userid}
                      onChange={(e) => onDeleteInputChange(e)}
                    />

                    {/* Submit button */}
                    <button id="deleteuser-button" type="submit">
                      Delete User
                    </button>

                    {successDeleteMessage && (
                      <p
                        id="success-deleted-message"
                        style={{ color: "green" }}
                      >
                        {successDeleteMessage}
                      </p>
                    )}

                    {/* Only render error message if it's present */}
                    {errorDeleteMessage && (
                      <p id="error-deleted-message" style={{ color: "red" }}>
                        {errorDeleteMessage}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              <div>
                <div className="admin-form access-user-form">
                  <h3>Access</h3>
                  <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="accessUserId">User ID:</label>
                <input
                  type="text"
                  id="accessUserId"
                  name="userid"
                  value={accessUserId}
                  onChange={(e) => onAccessInputChange(e)}
                />

                {/* Submit buttons */}
                {/* <div className="a-buttons"> */}
                <button
                  id="enableuser-button"
                  type="button"
                  onClick={(e) => onSubmitAccess(e, "enable")}
                >
                  Enable
                </button>
                <button
                  id="disableuser-button"
                  type="button"
                  onClick={(e) => onSubmitAccess(e, "disable")}
                >
                  Disable
                </button>
                
        
                {/* Only render success message if it's present */}
                {successAccessMessage && (
                  <p id="success-access-message" style={{ color: "green" }}>
                    {successAccessMessage}
                  </p>
                )}

                {/* Only render error message if it's present */}
                {errorAccessMessage && (
                  <p id="error-access-message" style={{ color: "red" }}>
                    {errorAccessMessage}
                  </p>
                )}
              </form>
              </div>
              </div>
            </div>
            </div>

            <div className="search-bar">
              {/* Search Bar Component */}
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <a>
                <i className="fa fa-search" aria-hidden="true"></i>
              </a>
            </div>

            <div className=" admin-table-container">
              <h3>User Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email ID</th>
                    {/* <th>Password</th> */}
                    <th>Username</th>
                    <th>User Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.userid}</td>
                      <td>{user.emailid}</td>
                      {/* <td>{user.password}</td> */}
                      <td>{user.username}</td>
                      <td>{user.usertype}</td>
                      <td>{user.enabled ? "Enable" : "Disable"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default Dashboard;
