import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Donation from "./pages/Donation";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Report from "./pages/Report";
import Members from "./pages/Members";
import Setting from "./pages/Setting";
import InvoicePage from "./pages/Donation/InvoicePage";
import SingleMember from "./pages/Members/SingleMember";
import NotFound from "./pages/404";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;
  // State to track the user's authentication status

  const user = localStorage.getItem("token");

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

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  };

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      {/* Dashboard */}
      {user ? (
        <Route path="/" element={<DashboardLayout />}>
          {isAdmin ? (
            <Route index exact element={<Dashboard />} />
          ) : (
            <Route index exact element={<Donation />} />
          )}
          <Route path="/donation" exact element={<Donation />} />

          {isAdmin && <Route path="/members/:id" element={<SingleMember />} />}
          {/* Route to the InvoicePage component */}
          {isAdmin && <Route path="/invoice/:id" element={<InvoicePage />} />}
          {isAdmin && <Route path="/report" exact element={<Report />} />}
          <Route path="/members" exact element={<Members />} />
          {isAdmin && <Route path="/setting" exact element={<Setting />} />}
        </Route>
      ) : (
        // If not logged in, redirect to the login page
        <Route path="/" element={<Navigate to="/login" />} />
      )}
      {user && <Route path="/login" element={<Navigate to="/" />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      {/* Define the 404 page route */}
    </Routes>
  );
}

export default App;
