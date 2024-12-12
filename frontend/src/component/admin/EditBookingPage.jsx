import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editBookingPage.css";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";

const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccessMessage] = useState(null);

  useEffect(() => {
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
  }, [bookingCode]);

  const acheiveBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to Acheive this booking?")) {
      return;
    }

    try {
      const response = await ApiService.cancelBooking(bookingId);
      if (response.statusCode === 200) {
        setSuccessMessage("The booking was Successfully Achieved");

        setTimeout(() => {
          setSuccessMessage("");
          navigate("/admin/manage-bookings");
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

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
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
          <p>Check-in Date: {bookingDetails.checkInDate}</p>
          <p>Check-out Date: {bookingDetails.checkOutDate}</p>
          <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
          <p>Num Of Children: {bookingDetails.numOfChildren}</p>
          <p>Total Num Of Guest: {bookingDetails.totalNumOfGuest}</p>
          <br />
          <hr />
          <br />
          <h3>Booker Details</h3>
          {bookingDetails.user ? (
            <div>
              <p>Name: {bookingDetails.user.name}</p>
              <p>Email: {bookingDetails.user.email}</p>
              <p>Phone Number: {bookingDetails.user.phoneNumber}</p>
            </div>
          ) : (
            <p>No user details available</p>
          )}

          <br />
          <hr />
          <br />
          <h3>Room Details</h3>
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
          <Button
            className="danger"
            onClick={() => acheiveBooking(bookingDetails.id)}
          >
            Achieve Booking
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditBookingPage;
