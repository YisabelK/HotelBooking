import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editBookingPage.css";
import Button from "../../component/Button";
import Modal from "../../component/Modal";
import Loading from "../../component/Loading";
import DetailsSection from "../../component/DetailsSection";
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

  const [activeSections, setActiveSections] = useState(["booking"]);

  const toggleSection = (section) => {
    setActiveSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  const isActive = (section) => activeSections.includes(section);

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
    <div className="edit-booking-page-container">
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
          <div className="booking-details-page-container">
            <DetailsSection
              title="Booking Details"
              isActive={isActive("booking")}
              onToggle={() => toggleSection("booking")}
            >
              <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
              <p>Check-in Date: {bookingDetails.checkInDate}</p>
              <p>Check-out Date: {bookingDetails.checkOutDate}</p>
              <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
              <p>Num Of Children: {bookingDetails.numOfChildren}</p>
              <p>Total Num Of Guest: {bookingDetails.totalNumOfGuest}</p>
              <p>
                Booking Status:
                <span
                  className={`status-${bookingDetails.status.toLowerCase()}`}
                >
                  {bookingDetails.status}
                </span>
              </p>
            </DetailsSection>

            <DetailsSection
              title="Booker Details"
              isActive={isActive("user")}
              onToggle={() => toggleSection("user")}
            >
              {bookingDetails.user ? (
                <div>
                  <p>Name: {bookingDetails.user.name}</p>
                  <p>Email: {bookingDetails.user.email}</p>
                  <p>Phone Number: {bookingDetails.user.phoneNumber}</p>
                </div>
              ) : (
                <p>No user details available</p>
              )}
            </DetailsSection>

            <DetailsSection
              title="Room Details"
              isActive={isActive("room")}
              onToggle={() => toggleSection("room")}
            >
              {bookingDetails.room ? (
                <div>
                  <p>Room Type: {bookingDetails.room.roomType}</p>
                  <p>Room Price: ${bookingDetails.room.roomPrice}</p>
                  <p>Room Description: {bookingDetails.room.roomDescription}</p>
                  <img
                    src={bookingDetails.room.roomPhotoUrl}
                    alt={bookingDetails.room.roomType}
                  />
                </div>
              ) : (
                <p>No room details available</p>
              )}
            </DetailsSection>
          </div>
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
