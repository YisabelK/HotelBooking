import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import Modal from "../../utils/Modal";
import BookingResult from "../common/BookingResult";
import "./findBookingPage.css";
import Button from "../../utils/Button";

const FindBookingPage = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingSearchResults, setBookingSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setError("Please Enter a booking confirmation code");
      return;
    }
    try {
      const response = await ApiService.getBookingByConfirmationCode(
        confirmationCode
      );
      setBookingSearchResults([response.booking]);
      setError(null);
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
      {bookingSearchResults && (
        <BookingResult bookingSearchResults={bookingSearchResults} />
      )}
    </div>
  );
};

export default FindBookingPage;
