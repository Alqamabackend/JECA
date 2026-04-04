import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaBars } from "react-icons/fa";
import { useState } from "react";

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white md:flex">
      {/* Sidebar */}
      <div
        className={`fixed md:fixed md:h-full z-20
        w-64 bg-gray-800 p-6 flex flex-col justify-between
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300`}
      >
        <div>
          <h2 className="text-2xl font-bold text-indigo-500 mb-10">
            JECA Portal
          </h2>

          <nav className="space-y-4">
            <Link
              to={role === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              <FaTachometerAlt /> Dashboard
            </Link>

            {role === "candidate" && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser /> My Profile
                </Link>

                <Link
                  to="/choices"
                  className="flex items-center gap-2 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  📋 My Choices
                </Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link
                  to="/admin/seats"
                  className="flex items-center gap-2 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  🪑 Manage Seats
                </Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link
                  to="/admin/colleges"
                  className="flex items-center gap-2 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  🏫 Manage Colleges
                </Link>
              </>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 relative z-0">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-xl"
          >
            <FaBars />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
