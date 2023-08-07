import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import "./index.css";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    //window.location.reload();
    document.location.replace("/");
  };
  return (
    <div>
      <div className="flex-column pt-3 pt-md-0 nav">
        <h1 className="text-center mt-1 mb-5">Temple</h1>
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
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/donation"
                className={({ isActive }) =>
                  isActive ? "NavActive" : "inactive"
                }
              >
                <i className="fa fa-pie-chart" aria-hidden="true"></i>
                <span>Donation</span>
              </NavLink>
            </li>
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

            {/* <li>
              <NavLink
                to="/members-list"
                className={({ isActive }) =>
                  isActive ? "NavActive" : "inactive"
                }
              >
                <i className="fa fa-users" aria-hidden="true"></i>
                <span>Members List</span>
              </NavLink>
            </li> */}

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

            <li>
              <NavLink
                to="/setting"
                className={({ isActive }) =>
                  isActive ? "NavActive" : "inactive"
                }
              >
                <i className="fa fa-book" aria-hidden="true"></i>
                <span>Setting</span>
              </NavLink>
            </li>

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
  );
};
export default Header;
