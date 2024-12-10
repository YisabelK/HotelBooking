import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ErrorModal from "../../utils/Modal";
import "./profilePage.css";
import Button from "../../utils/Button";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [error, setError] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const navigate = useNavigate();

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getUserProfile();
        console.log("User Profile Response:", response);
        setUser(response.user);
        setPastBookings(response.pastBookings || []);
        setUpcomingBookings(response.upcomingBookings || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const renderBookingList = (bookings, title) => (
    <div className="booking-section">
      <h3>{title}</h3>
      <div className="booking-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <p>
                <strong>Booking Code:</strong> {booking.bookingConfirmationCode}
              </p>
              <p>
                <strong>Check-in Date:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out Date:</strong>{" "}
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
              {booking.room && (
                <>
                  <p>
                    <strong>Room Type:</strong> {booking.room.roomType}
                  </p>
                  <p>
                    <strong>Room Price:</strong> ${booking.room.roomPrice}
                  </p>
                  {booking.room.roomPhotoUrl && (
                    <img
                      src={booking.room.roomPhotoUrl}
                      alt="Room"
                      className="room-photo"
                    />
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No {title.toLowerCase()} found</p>
        )}
      </div>
    </div>
  );

  const toggleUpcoming = () => {
    setShowUpcoming(!showUpcoming);
    setShowPast(false);
  };

  const togglePast = () => {
    setShowPast(!showPast);
    setShowUpcoming(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-page">
        {error && <ErrorModal message={error} onClose={handleCloseError} />}
        {user && <h2>Welcome, {user.name}</h2>}
        <div className="profile-actions">
          <Button onClick={handleEditProfile}>Edit Profile</Button>
          <Button
            className={`profile-button ${showUpcoming ? "active" : ""}`}
            onClick={toggleUpcoming}
          >
            Upcoming Bookings ({upcomingBookings.length})
          </Button>
          <Button
            className={`profile-button ${showPast ? "active" : ""}`}
            onClick={togglePast}
          >
            Past Bookings ({pastBookings.length})
          </Button>
        </div>

        {user && (
          <div className="profile-details">
            <h3>My Profile</h3>
            <div className="profile-info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${user.streetName || ""} ${user.houseNumber || ""}`}
              </p>
              <p>
                <strong>City:</strong> {user.city || ""}
              </p>
              <p>
                <strong>State:</strong> {user.state || ""}
              </p>
              <p>
                <strong>Postal Code:</strong> {user.postalCode || ""}
              </p>
              <p>
                <strong>Country:</strong> {user.country || ""}
              </p>
              <p>
                <strong>Birth Date:</strong>{" "}
                {user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString()
                  : ""}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender || ""}
              </p>
            </div>
          </div>
        )}

        <div className="bookings-section">
          {showUpcoming &&
            renderBookingList(upcomingBookings, "Upcoming Bookings")}
          {showPast && renderBookingList(pastBookings, "Past Bookings")}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
