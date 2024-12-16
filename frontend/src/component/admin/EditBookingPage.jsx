import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editBookingPage.css";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
import BookingDetailsPage from "../booking_rooms/BookingDetailsPage";

const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccessMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!ApiService.isAdmin()) {
      navigate("/login");
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByConfirmationCode(
          bookingCode
        );
        console.log("Booking Response:", response);

        if (response && response.booking) {
          console.log("Booking Details:", response.booking);
          console.log("User Details:", response.booking.user);
          console.log("Room Details:", response.booking.room);
          setBookingDetails(response.booking);
        } else {
          setError("Booking details not found");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError(error.message || "Error fetching booking details");
      }
    };

    if (bookingCode) {
      fetchBookingDetails();
    }
  }, [bookingCode, navigate]);

  const handleCloseError = () => {
    setError("");
  };

  const handleCloseSuccess = () => {
    setSuccessMessage("");
    navigate("/admin/manage-bookings");
  };

  return (
    <div className="find-booking-page">
      <h2>Booking Detail</h2>
      {error && (
        <Modal type="error" message={error} onClose={handleCloseError} />
      )}
      {success && (
        <Modal type="success" message={success} onClose={handleCloseSuccess} />
      )}
      {bookingDetails && (
        <>
          <BookingDetailsPage bookingDetails={bookingDetails} />
          {message !== null ? (
            <div className="status-message">
              <p>{message}</p>
            </div>
          ) : (
            <>
              <div className="form-button-container">
                <Button
                  className="approve-button"
                  onClick={() => setMessage("This booking has been approved")}
                >
                  Approve Booking
                </Button>

                <Button
                  className="danger"
                  onClick={() => setMessage("This booking has been cancelled")}
                >
                  Cancel Booking
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EditBookingPage;
