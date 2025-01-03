import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import FooterComponent from "./component/Footer";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import HomePage from "./page/HomePage";
import RoomReservationPage from "./page/RoomReservationPage";
import RoomDetailsBookingPage from "./page/RoomDetailsPage";
import FindBookingPage from "./page/FindBookingPage";
import AdminPage from "./page/admin/AdminPage";
import ManageRoomPage from "./page/admin/ManageRoomPage";
import EditRoomPage from "./page/admin/EditRoomPage";
import AddRoomPage from "./page/admin/AddRoomPage";
import ManageBookingsPage from "./page/admin/ManageBookingsPage";
import EditBookingPage from "./page/admin/EditBookingPage";
import UserProfilePage from "./page/UserProfilePage";
import EditUserProfilePage from "./page/EditUserProfilePage";
import { ProtectedRoute, AdminRoute } from "./service/guard";
import AboutPage from "./page/AboutPage";
import ContactPage from "./page/ContactPage";
import AllUsersPage from "./page/admin/AllUsersPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rooms" element={<RoomReservationPage />} />
            <Route path="/find-booking" element={<FindBookingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/home" />} />

            {/* Protected Routes */}
            <Route
              path="/room-details-book/:roomId"
              element={<ProtectedRoute element={<RoomDetailsBookingPage />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<UserProfilePage />} />}
            />
            <Route
              path="/edit-profile"
              element={<ProtectedRoute element={<EditUserProfilePage />} />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />
            <Route
              path="/admin/all-users"
              element={<AdminRoute element={<AllUsersPage />} />}
            />
            <Route
              path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage />} />}
            />
            <Route
              path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoomPage />} />}
            />
            <Route
              path="/admin/add-room"
              element={<AdminRoute element={<AddRoomPage />} />}
            />
            <Route
              path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} />}
            />
            <Route
              path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} />}
            />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
