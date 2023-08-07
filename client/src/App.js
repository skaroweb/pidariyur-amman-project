import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Donation from "./pages/Donation";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Report from "./pages/Report";
import Members from "./pages/Members";
import Setting from "./pages/Setting";
import InvoicePage from "./pages/Donation/InvoicePage";
import NotFound from "./pages/404";

function App() {
  // State to track the user's authentication status

  const user = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      {/* Dashboard */}
      {user ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index exact element={<Dashboard />} />
          <Route path="/donation" exact element={<Donation />} />
          {/* Route to the InvoicePage component */}
          <Route path="/invoice/:id" element={<InvoicePage />} />
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
      {/* Define the 404 page route */}
    </Routes>
  );
}

export default App;
