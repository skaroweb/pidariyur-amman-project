import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Main from "./pages/Main";
import Signup from "./pages/Singup";
import Login from "./pages/Login";
import Report from "./pages/Report";
import Members from "./pages/Members";
import Setting from "./pages/Setting";

function App() {
  // State to track the user's authentication status

  const user = localStorage.getItem("token");

  return (
    <Routes>
      {/* Dashboard */}
      {user ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index exact element={<Main />} />
          <Route path="/report" exact element={<Report />} />
          <Route path="/members" exact element={<Members />} />
          <Route path="/setting" exact element={<Setting />} />
        </Route>
      ) : (
        // If not logged in, redirect to the login page
        <Route path="/" element={<Navigate to="/login" />} />
      )}
      {user && <Route path="/login" element={<Navigate to="/" />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
    </Routes>
  );
}

export default App;
