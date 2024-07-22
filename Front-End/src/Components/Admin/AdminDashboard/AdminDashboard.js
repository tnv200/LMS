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
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sendCredentialsVisible, setSendCredentialsVisible] = useState(false);
  const handleCloseModal = () => {
    setSendCredentialsVisible(false);
  };

  const handleSendCredentials = async () => {
    if (!selectedUserId) {
      alert("Please select a user to send credentials.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/sendCredentials`, {
        userId: selectedUserId,
      });
      alert(response.data); // Display success message
      setSendCredentialsVisible(false); // Close the modal after sending credentials
    } catch (error) {
      console.error("Error sending credentials:", error);
      alert("Error sending credentials. Please try again.");
      setSendCredentialsVisible(false); // Display error message
    }
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
  
  //delete user table function

  const onDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/delete-user`,
        { userid: userId }
      );

      if (response.status === 200) {
        alert("User is deleted Successfully")
        DeleteUser(prevState => ({ ...prevState, userid: "" }));
        loadUsers();
      } else if (response.status === 404) { 
        alert(response.data);
      } else {
        alert("User is already mapped with data");
        setSuccessDeleteMessage(""); // Clear any previous success message
      }
    } catch (axiosError) {
      console.error("Error from axios:", axiosError);

      if (axiosError.response && axiosError.response.status === 400) {
        setErrorDeleteMessage(axiosError.response.data);
      } else if (axiosError.response && axiosError.response.status === 404) {
        alert(axiosError.response.data);
      } else {
        alert("User is already mapped with data");
      }
    }
  };
  
  const [deleteuser, DeleteUser] = useState({ userid: "" });
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [errorDeleteMessage, setErrorDeleteMessage] = useState("");
  //delete-user form backend functions
  
  //toggle access module
  const handleToggleAccess = async (user) => {
    const action = user.enabled ? 'disable' : 'enable'; // Toggle the action based on the current user status
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmAction) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/${action}-user`,
        { userid: user.userid }
      );
  
      if (response.status === 200) {
        alert(`User access ${action === 'enable' ? 'enabled' : 'disabled'} successfully.`);
        loadUsers(); // Reload the user data
      } else if (response.status === 404) {
        alert(response.data);
      } else {
        alert(`Failed to ${action} user access.`);
      }
    } catch (error) {
      console.error(`Error ${action}-user:`, error);
      alert(`Error ${action}-user. Please try again later.`);
    }
  };

  //edit user button table 

  const [accessUser, setAccessUser] = useState({ userid: "" });
  const { userid: accessUserId } = accessUser;

  const onAccessInputChange = (e) => {
    setAccessUser({ ...accessUser, [e.target.name]: e.target.value });
  };
  const [editUserFormVisible, setEditUserFormVisible]= useState(false);
  const toggleEditUserFormVisibility=() =>{
    setEditUserFormVisible(!editUserFormVisible);
  }
  const [edituser, setEditUser] = useState({
    userid: "",
    emailid: "",
    username: "",
    usertype: "",
  });
  const handleEditUser = (user) => {
    setEditUser({
      userid: user.userid,
      emailid: user.emailid,
      username: user.username,
      usertype: user.usertype,
    });
    toggleEditUserFormVisibility();
  };
  
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
  const [addUserFormVisible, setAddUserFormVisible]= useState(false);
  const [adduser, AddUser] = useState({
    userid: "",
    emailid: "",
    password: "",
    username: "",
    usertype: "",
  });
  const toggleAddUserFormVisibility=() =>{
    setAddUserFormVisible(!addUserFormVisible);
  }
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
              <div className="button-container">              
                <button className="add-user-button" onClick={toggleAddUserFormVisibility}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add User</button>            
                <button className="send-user-button" onClick={() => setSendCredentialsVisible(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="2 0 24 24"
                  width="24"
                  height="20"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
                  Send Credentials</button>
                </div>
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email ID</th>
                    {/* <th>Password</th> */}
                    <th>Username</th>
                    <th>User Type</th>
                    <th>Access</th>
                    <th>Actions</th>
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
                      <td>
                        <div className="access-toggle-switch">
                          <input
                            className="access-toggle-input"
                            id={`access-toggle-${user.userid}`}
                            type="checkbox"
                            checked={user.enabled}
                            onChange={() => handleToggleAccess(user)}
                          />
                          <label
                            className="access-toggle-label"
                            htmlFor={`access-toggle-${user.userid}`}
                            ></label>
                          {/* <p>
                          {user.enabled ? "Enable" : "Disable"}
                          </p> */}
                        </div>               
                      </td>
                      <td>
                        <div>
                          <button className="edit-user-button" onClick={() => handleEditUser(user)}>Edit</button>
                        </div>
                        <div>                        
                          <button className="delete-user-button" onClick={()=> onDeleteUser(user.userid)}>Delete</button>
                        </div>
                      </td>
                      {/* <td>  
                          <div className="button">
                          <button type="submit" className="send-user-button">
                            <div class="svg-wrapper-1">
                              <div class="svg-wrapper">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="2 0 24 24"
                                width="24"
                                height="20"
                                >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                  fill="currentColor"
                                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                ></path>
                                </svg>
                              </div>
                            </div>
                          </button>
                        </div>
                      </td>               */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {addUserFormVisible &&
            (
              <div className="overlay" onclick={toggleAddUserFormVisibility}>
                  <div className="admin-form add-user-form" onClick={(e) => e.stopPropagation()}>
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
                    <button id="cancel-button" type="button" onClick={toggleAddUserFormVisibility}>
                    <svg height="20px" viewBox="0 0 384 512">
                      <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                      ></path>
                    </svg>
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
            )
            }
            {
              editUserFormVisible &&
              (
                <div className="overlay" onClick={toggleEditUserFormVisibility}>
                <div className="admin-form edit-user-form" onClick={(e)=> e.stopPropagation()} >
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
                    <button id="cancel" type="button" onClick={toggleEditUserFormVisibility}>
                    <svg height="20px" viewBox="0 0 384 512">
                      <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                      ></path>
                    </svg>
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
              )
            }
            {sendCredentialsVisible && (
              <div className="overlay">
              <div className="send-credentials-modal">
                <h3>Send Credentials</h3>
                <div>
                  <label htmlFor="userSelect">Select User:</label>
                  <select
                    id="userSelect"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.userid} value={user.userid}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSendCredentials}>Send</button>
                <button id="cancel" type="button" onClick={handleCloseModal}>
                <svg height="20px" viewBox="0 0 384 512">
                      <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                      ></path>
                    </svg>
                </button>
              </div>
            </div>  
            )}

          </div>
        </div>
      </div>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  );
};

export default Dashboard;