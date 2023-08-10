import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import "./index.css";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    //window.location.reload();
    document.location.replace("/");
  };
  const [click, setClick] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;
  // State to track the user's authentication status

  const handleClick = () => setClick(!click);

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
    <div>
      {/* <nav className="navbar-theme-primary px-4 d-md-none navbar navbar-dark justify-content-end">
        <div className="nav-icon" onClick={handleClick}>
          <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
        </div>
      </nav> */}
      {/* <div
        className={`sidebar-inner px-4 pt-3 ${click === true ? "active" : ""}`}
      > */}
      <div className="flex-column pt-3 pt-md-0 nav">
        <nav className={styles.navbar}>
          <ul className={styles.header_nav}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "NavActive" : "inactive"
                }
              >
                <i className="fa fa-pie-chart" aria-hidden="true"></i>
                <span>{isAdmin ? "Dashboard" : "Donation"}</span>
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/donation"
                  className={({ isActive }) =>
                    isActive ? "NavActive" : "inactive"
                  }
                >
                  <i className="fa-solid fa-circle-dollar-to-slot"></i>
                  <span>Donation</span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/members"
                className={({ isActive }) =>
                  isActive ? "NavActive" : "inactive"
                }
              >
                <i className="fa fa-users" aria-hidden="true"></i>
                <span>Members</span>
              </NavLink>
            </li>

            {isAdmin && (
              <li>
                <NavLink
                  to="/report"
                  className={({ isActive }) =>
                    isActive ? "NavActive" : "inactive"
                  }
                >
                  <i className="fa fa-book" aria-hidden="true"></i>
                  <span>Report</span>
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/setting"
                  className={({ isActive }) =>
                    isActive ? "NavActive" : "inactive"
                  }
                >
                  <i className="fa-solid fa-gear"></i>
                  <span>Setting</span>
                </NavLink>
              </li>
            )}

            <li>
              <button onClick={handleLogout}>
                <i className="fa fa-power-off" aria-hidden="true"></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    // </div>
  );
};
export default Header;
