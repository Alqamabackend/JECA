import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MyChoices from "./pages/MyChoices";
import ManageSeats from "./pages/ManageSeats";
import Profile from "./pages/Profile";
import ManageColleges from "./pages/ManageColleges";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/choices"
        element={
          <ProtectedRoute role="candidate">
            <MyChoices />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/seats" element={<ManageSeats />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/colleges" element={<ManageColleges />} />
    </Routes>
  );
}

export default App;
