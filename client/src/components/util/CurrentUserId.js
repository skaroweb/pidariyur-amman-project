import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentUserId = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token to get user information (e.g., user ID)
      const decodedToken = parseJwt(token);
      const currentUserId = decodedToken._id;

      // Make an API request to get user data
      axios
        .get(`${serverURL}/api/user/`)
        .then((response) => {
          // Find the user with the currentUserId from the fetched data

          const currentUser = response.data.find(
            (user) => user._id === currentUserId
          );

          if (currentUser) {
            setIsAdmin(currentUser.isAdmin);
          } else {
            console.log("User not found in fetched data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  // Function to parse the JWT token
  const parseJwt = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  };

  return isAdmin;
};

export default CurrentUserId;
