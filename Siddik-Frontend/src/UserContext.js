// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(() => {
    // Load user details from localStorage on initial render
    const storedUserDetails = localStorage.getItem("userDetails");
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });

  const setUserData = (user) => {
    setUserDetails(user);
    // Store user details in localStorage
    localStorage.setItem("userDetails", JSON.stringify(user));
  };

  return (
    <UserContext.Provider value={{ userDetails, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { userDetails, setUserData } = useContext(UserContext);
  // console.log(userDetails);
  // Additional logic to check localStorage if userDetails is null
  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (!userDetails && storedUserDetails) {
      setUserData(JSON.parse(storedUserDetails));
    }
  }, [userDetails, setUserData]);

  return { userDetails, setUserData };
};
