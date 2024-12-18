import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./navbar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    const isLogout = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (isLogout) {
      ApiService.logout();
      navigate("/home");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        {!isAuthenticated && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Join
            </NavLink>
          </>
        )}
        {isAuthenticated && <span onClick={handleLogout}>Logout</span>}
        <NavLink
          to="/find-booking"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Search Booking
        </NavLink>
      </div>
      <div className="navbar-brand">
        <NavLink to="/home">The Han</NavLink>
        <a href="/home">
          <p>Hotels & Resorts</p>
        </a>
      </div>
      <ul className="navbar-ul">
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
            Reservation <CalendarMonthIcon fontSize="small" />
          </NavLink>
        </li>
        {isUser && (
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <PersonIcon fontSize="small" />
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
      </ul>
    </nav>
  );
}

export default Navbar;
