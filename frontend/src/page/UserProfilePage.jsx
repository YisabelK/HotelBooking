import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import ErrorModal from "../component/Modal";
import "./userProfilePage.css";
import Button from "../component/Button";
import Field from "../component/Field";
import Loading from "../component/Loading";
import DetailsSection from "../component/DetailsSection";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [error, setError] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSections, setActiveSections] = useState([]);

  const navigate = useNavigate();

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getUserProfile();
        setUser(response.user);
        setPastBookings(response.pastBookings || []);
        setUpcomingBookings(response.upcomingBookings || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.response?.data?.message || error.message);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <Loading message="Loading profile..." />;
  }

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const toggleSection = (bookingId) => {
    setActiveSections((prev) => {
      if (prev.includes(bookingId)) {
        return prev.filter((id) => id !== bookingId);
      } else {
        return [...prev, bookingId];
      }
    });
  };

  const renderBookingList = (bookings, title) => (
    <>
      <h2>{title}</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <DetailsSection
            key={booking.id}
            title={booking.bookingConfirmationCode}
            isActive={activeSections.includes(booking.id)}
            onToggle={() => toggleSection(booking.id)}
          >
            <Field
              label="Booking Confirmation Code"
              value={booking.bookingConfirmationCode}
            />
            <Field
              label="Check-in Date"
              value={new Date(booking.checkInDate).toLocaleDateString()}
            />
            <Field
              label="Check-out Date"
              value={new Date(booking.checkOutDate).toLocaleDateString()}
            />
            <Field
              label="Booking Status"
              value={
                <span className={`status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              }
            />
            {booking.room && (
              <>
                <Field label="Room Type" value={booking.room.roomType} />
                <Field
                  label="Room Price"
                  value={`$${booking.room.roomPrice}`}
                />
                {booking.room.roomPhotoUrl && (
                  <img src={booking.room.roomPhotoUrl} alt="Room" />
                )}
              </>
            )}
          </DetailsSection>
        ))
      ) : (
        <p>No bookings found</p>
      )}
    </>
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
            className={`${showUpcoming ? "active" : ""}`}
            onClick={toggleUpcoming}
          >
            Upcoming Bookings ({upcomingBookings.length})
          </Button>
          <Button
            className={`${showPast ? "active" : ""}`}
            onClick={togglePast}
          >
            Past Bookings ({pastBookings.length})
          </Button>
        </div>

        {user && (
          <div className="profile-details">
            <h3>My Profile</h3>
            <div className="profile-info">
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phoneNumber} />
              <Field
                label="Address"
                value={`${user.streetName || ""} ${user.houseNumber || ""}`}
              />
              <Field label="City" value={user.city} />
              <Field label="State" value={user.state} />
              <Field label="Postal Code" value={user.postalCode} />
              <Field label="Country" value={user.country} />
              <Field
                label="Birth Date"
                value={
                  user.birthDate
                    ? new Date(user.birthDate).toLocaleDateString()
                    : ""
                }
              />
              <Field label="Gender" value={user.gender} />
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

export default UserProfilePage;
