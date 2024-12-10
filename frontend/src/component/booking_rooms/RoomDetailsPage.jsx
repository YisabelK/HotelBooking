import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService"; // Assuming your service is in a file called ApiService.js
import DatePicker from "react-datepicker";
import "./roomDetailsPage.css";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
  const navigate = useNavigate(); // Access the navigate function to navigate
  const { roomId } = useParams(); // Get room ID from URL parameters
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const [checkInDate, setCheckInDate] = useState(null); // State variable for check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // State variable for check-out date
  const [numAdults, setNumAdults] = useState(1); // State variable for number of adults
  const [numChildren, setNumChildren] = useState(0); // State variable for number of children
  const [totalPrice, setTotalPrice] = useState(0); // State variable for total booking price
  const [totalGuests, setTotalGuests] = useState(1); // State variable for total number of guests
  const [showDatePicker, setShowDatePicker] = useState(false); // State variable to control date picker visibility
  const [userId, setUserId] = useState(""); // Set user id
  const [confirmationCode, setConfirmationCode] = useState(""); // State variable for booking confirmation code
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message
  const [isAdmin, setIsAdmin] = useState(false); // State variable to control admin access
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
        setIsAdmin(userProfile.user.isAdmin); // Set admin access based on user profile
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
    };
    fetchData();
  }, [roomId]); // Re-run effect when roomId changes

  const handleConfirmBooking = async () => {
    // Check if check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select check-in and check-out dates.");
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds
      return;
    }

    // Check if number of adults and children are valid
    if (
      isNaN(numAdults) ||
      numAdults < 1 ||
      isNaN(numChildren) ||
      numChildren < 0
    ) {
      setErrorMessage("Please enter valid numbers for adults and children.");
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds
      return;
    }

    // Calculate total number of days
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));

    // Calculate total number of guests
    const totalGuests = numAdults + numChildren;

    // Calculate total price
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
    setShowCheckButton(false);
  };

  const acceptBooking = async () => {
    try {
      // Ensure checkInDate and checkOutDate are Date objects
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);

      // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
      const formattedCheckInDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      const formattedCheckOutDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      // Log the original dates for debugging
      console.log("Formated Check-in Date:", formattedCheckInDate);
      console.log("Formated Check-out Date:", formattedCheckOutDate);

      // Create booking object
      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren,
      };
      console.log(booking);
      console.log(checkOutDate);

      // Make booking
      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowSuccessModal(true); // Show modal instead of message
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/profile"); // Navigate to profile page
  };
  const handleCloseError = () => {
    setErrorMessage("");
  };

  if (isLoading) {
    return <p className="room-detail-loading">Loading room details...</p>;
  }

  if (error) {
    return <Modal message={error} onClose={() => setError("")} />;
  }

  if (!roomDetails) {
    return <p className="room-detail-loading">Room not found.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, roomDescription, bookings } =
    roomDetails;

  return (
    <div className="room-details-booking">
      {showSuccessModal && (
        <Modal
          type="success"
          message={`Booking successful! Confirmation code: ${confirmationCode}. An SMS and email of your booking details have been sent to you.`}
          onClose={handleCloseSuccessModal}
        />
      )}
      {errorMessage && (
        <Modal type="error" message={errorMessage} onClose={handleCloseError} />
      )}
      <h2>Room Details</h2>
      <br />
      <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Price: ${roomPrice} / night</p>
        <p>Description: {roomDescription}</p>
      </div>
      {isAdmin && bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number">Booking {index + 1} </span>
                <span className="booking-text">
                  Check-in: {booking.checkInDate}{" "}
                </span>
                <span className="booking-text">
                  Out: {booking.checkOutDate}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <div className="booking-buttons">
          {!showDatePicker && (
            <Button
              className="book-now-button"
              onClick={() => setShowDatePicker(true)}
            >
              Book Now
            </Button>
          )}
        </div>
        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              className="detail-search-field"
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                setShowCheckButton(true);
                setTotalPrice(0);
              }}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              className="detail-search-field"
              selected={checkOutDate}
              onChange={(date) => {
                setCheckOutDate(date);
                setShowCheckButton(true);
                setTotalPrice(0);
              }}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              dateFormat="yyyy-MM-dd"
            />
            <div className="guest-container">
              <div className="guest-div">
                <label>Adults:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => {
                    setNumAdults(parseInt(e.target.value));
                    setShowCheckButton(true);
                    setTotalPrice(0);
                  }}
                />
              </div>
              <div className="guest-div">
                <label>Children:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => {
                    setNumChildren(parseInt(e.target.value));
                    setShowCheckButton(true);
                    setTotalPrice(0);
                  }}
                />
              </div>
              {showCheckButton && (
                <Button
                  className="confirm-booking"
                  onClick={handleConfirmBooking}
                >
                  Check Availability & Price
                </Button>
              )}
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className="total-price">
            <p>Total Price: ${totalPrice}</p>
            <p>Total Guests: {totalGuests}</p>
            <Button onClick={acceptBooking} className="accept-booking">
              Accept Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
