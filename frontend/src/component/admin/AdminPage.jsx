import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./adminPage.css";
import Button from "../../utils/Button";
import ManageRoomPage from "./ManageRoomPage";
import ManageBookingsPage from "./ManageBookingsPage";

const AdminPage = () => {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const response = await ApiService.getUserProfile();
        setAdminName(response.user.name);
      } catch (error) {
        console.error("Error fetching admin details:", error.message);
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="welcome-message">Hi, {adminName}</h1>
      <div className="form-button-container">
        <Button onClick={() => navigate("/admin/manage-rooms")}>
          Manage Rooms
        </Button>
        <Button onClick={() => navigate("/admin/manage-bookings")}>
          Manage Bookings
        </Button>
        <Button onClick={() => navigate("/admin/all-users")}>All Users</Button>
      </div>
      <ManageBookingsPage />
    </div>
  );
};

export default AdminPage;
