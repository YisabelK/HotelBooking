import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./adminPage.css";
import Button from "../ui/Button";
import ManageBookingsPage from "./ManageBookingsPage";
import Loading from "../ui/Loading";
const AdminPage = () => {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getUserProfile();
        setAdminName(response.user.name);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching admin details:", error.message);
        setIsLoading(false);
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="admin-page">
      {isLoading && <Loading message="Loading admin details..." />}
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
