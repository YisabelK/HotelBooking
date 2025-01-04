import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import "./navbar.css";

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    const isLogout = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (isLogout) {
      ApiService.logout();
      navigate("/home");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/home" onClick={closeSidebar}>
            The Han
          </NavLink>
          <a href="/home" onClick={closeSidebar}>
            <p>Hotels & Resorts</p>
          </a>
        </div>
        <div className="navbar-right">
          <ul className="navbar-right-ul">
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About The Han
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rooms"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Our Rooms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/find-booking"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Search Booking
              </NavLink>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Join
                  </NavLink>
                </li>
              </>
            )}
            {isUser && (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  My Page
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <span onClick={handleLogout}>Logout</span>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-toggle" onClick={toggleSidebar}>
          {!isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="var(--text-color)"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="var(--text-color)"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="sidebar">
          <ul className="sidebar-ul">
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeSidebar}
              >
                About The Han
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rooms"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeSidebar}
              >
                Our Rooms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/find-booking"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeSidebar}
              >
                Search Booking
              </NavLink>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeSidebar}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeSidebar}
                  >
                    Join
                  </NavLink>
                </li>
              </>
            )}
            {isUser && (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  My Page
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <span
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
