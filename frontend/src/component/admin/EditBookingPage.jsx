import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editBookingPage.css";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
import BookingDetailsPage from "../booking_rooms/BookingDetailsPage";
import Loading from "../../utils/Loading";
const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccessMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!ApiService.isAdmin()) {
      navigate("/login");
      return;
    }

    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getBookingByConfirmationCode(
          bookingCode
        );

        if (response && response.booking) {
          setBookingDetails(response.booking);
        } else {
          setError("Booking details not found");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError(error.message || "Error fetching booking details");
      }
      setIsLoading(false);
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

  const handleApproveBooking = async () => {
    try {
      if (!bookingDetails || !bookingDetails.id) {
        setError("Booking details not found");
        return;
      }
      setIsLoading(true);
      const response = await ApiService.updateBookingStatus(
        bookingDetails.id,
        "CONFIRMED"
      );

      if (response && response.statusCode === 200) {
        setSuccessMessage("Booking has been approved successfully");
        setMessage("This booking has been approved");
        setBookingDetails(response.booking);
      } else {
        setError(response?.message || "Failed to approve booking");
      }
      setIsLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve booking"
      );
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      if (!bookingDetails || !bookingDetails.id) {
        setError("Booking details not found");
        return;
      }
      setIsLoading(true);
      const response = await ApiService.updateBookingStatus(
        bookingDetails.id,
        "CANCELLED"
      );

      if (response && response.statusCode === 200) {
        setSuccessMessage("Booking has been cancelled successfully");
        setMessage("This booking has been cancelled");
        setBookingDetails(response.booking);
      } else {
        setError(response?.message || "Failed to cancel booking");
      }
      setIsLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel booking"
      );
      setIsLoading(false);
    }
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
      {isLoading && <Loading message="Loading booking..." />}
      {bookingDetails && (
        <>
          <BookingDetailsPage bookingDetails={bookingDetails} />
          <div className="status-message">{message && <p>{message}</p>}</div>
          {!message && (
            <div className="form-button-container">
              {bookingDetails.status !== "CONFIRMED" && (
                <Button
                  className="approve-button"
                  onClick={handleApproveBooking}
                >
                  Approve Booking
                </Button>
              )}
              {bookingDetails.status !== "CANCELLED" && (
                <Button className="danger" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditBookingPage;
