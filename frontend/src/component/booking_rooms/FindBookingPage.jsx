import React, { useState } from "react";
import ApiService from "../../service/ApiService"; // Assuming your service is in a file called ApiService.js
import Modal from "../../utils/Modal";
import "./findBookingPage.css";
import Button from "../../utils/Button";

const FindBookingPage = () => {
  const [confirmationCode, setConfirmationCode] = useState(""); // State variable for confirmation code
  const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
  const [error, setError] = useState(null); // Track any errors

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setError("Please Enter a booking confirmation code");
      return;
    }
    try {
      // Call API to get booking details
      const response = await ApiService.getBookingByConfirmationCode(
        confirmationCode
      );
      setBookingDetails(response.booking);
      setError(null); // Clear error if successful
    } catch (error) {
      setError(
        `Booking with confirmation code '${confirmationCode}' was not found.`
      );
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="find-booking-page">
      {error && (
        <Modal type="error" message={error} onClose={handleCloseError} />
      )}
      {!bookingDetails && (
        <div className="booking-intro">
          <h2>My Reservation</h2>
          <div className="booking-intro-content">
            <div className="booking-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <p className="booking-prompt">
              Do you have a booking confirmation code?
            </p>
            <p className="booking-subtext">
              The confirmation code was sent to your email when you made the
              reservation
            </p>
          </div>
        </div>
      )}
      <div className="search-container">
        <input
          required
          type="text"
          placeholder="Enter your booking confirmation code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <Button onClick={handleSearch}>Find</Button>
      </div>
      {bookingDetails && (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
          <p>Check-in Date: {bookingDetails.checkInDate}</p>
          <p>Check-out Date: {bookingDetails.checkOutDate}</p>
          <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
          <p>Num Of Children: {bookingDetails.numOfChildren}</p>

          <br />
          <hr />
          <br />
          <h3>Booker Details</h3>
          <div>
            {bookingDetails.user ? (
              <>
                <p>Name: {bookingDetails.user.name}</p>
                <p>Email: {bookingDetails.user.email}</p>
                <p>Phone Number: {bookingDetails.user.phoneNumber}</p>
              </>
            ) : (
              <p>No user details available</p>
            )}
          </div>

          <br />
          <hr />
          <br />
          <h3>Room Details</h3>
          <div>
            {bookingDetails.room ? (
              <>
                <p>Room Type: {bookingDetails.room.roomType}</p>
                <img
                  src={bookingDetails.room.roomPhotoUrl}
                  alt={bookingDetails.room.roomType}
                  sizes=""
                  srcSet=""
                />
              </>
            ) : (
              <p>No room details available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindBookingPage;
