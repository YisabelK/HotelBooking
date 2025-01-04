import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import DatePicker from "react-datepicker";
import "./roomDetailsPage.css";
import Button from "../component/Button";
import Modal from "../component/Modal";
import Loading from "../component/Loading";
import RoomDetails from "../component/RoomDetails";

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select check-in and check-out dates.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (
      isNaN(numAdults) ||
      numAdults < 1 ||
      isNaN(numChildren) ||
      numChildren < 0
    ) {
      setErrorMessage("Please enter valid numbers for adults and children.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));

    const totalGuests = numAdults + numChildren;
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
    setShowCheckButton(false);
  };

  const acceptBooking = async () => {
    try {
      const userProfile = await ApiService.getUserProfile();
      setUserId(userProfile.user.id);
      setIsLoggedIn(true);

      const booking = {
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        numOfAdults: numAdults,
        numOfChildren: numChildren,
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowSuccessModal(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
        return;
      }
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const formatDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/profile");
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        from: `/room-details/${roomId}`,
        bookingData: { checkInDate, checkOutDate, numAdults, numChildren },
      },
    });
  };

  if (isLoading) return <Loading message="Loading room details..." />;
  if (error) return <Modal message={error} onClose={() => setError("")} />;
  if (!roomDetails)
    return <p className="room-detail-loading">Room not found.</p>;

  return (
    <div className="room-details-page-container">
      {showSuccessModal && (
        <Modal
          type="success"
          message={`Booking successful! Confirmation code: ${confirmationCode}. An SMS and email of your booking details have been sent to you.`}
          onClose={handleCloseSuccessModal}
        />
      )}
      {showLoginModal && (
        <Modal
          type="error"
          message="Please log in to complete your booking"
          onClose={() => setShowLoginModal(false)}
          actionButton={{
            text: "Login",
            onClick: handleLoginRedirect,
          }}
        />
      )}
      {errorMessage && (
        <Modal type="error" message={errorMessage} onClose={handleCloseError} />
      )}

      <RoomDetails roomDetails={roomDetails} isAdmin={isAdmin} />

      <div className="booking-info">
        <div className="form-button-container">
          {!showDatePicker && (
            <Button onClick={() => setShowDatePicker(true)}>Book Now</Button>
          )}
        </div>
        {showDatePicker && (
          <div className="booking-modal-overlay">
            <div className="booking-modal">
              <div className="booking-modal-header">
                <h2>Make a Reservation</h2>
                <button
                  className="close-modal"
                  onClick={() => setShowDatePicker(false)}
                >
                  ×
                </button>
              </div>

              <div className="booking-modal-content">
                <div className="booking-modal-room-info">
                  <h3>{roomDetails.roomType}</h3>
                  <p className="room-price">
                    ${roomDetails.roomPrice} <span>per night</span>
                  </p>
                </div>

                <div className="date-picker-container">
                  <div className="date-picker-wrapper">
                    <label>Check In</label>
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
                      placeholderText="Select check-in date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>

                  <div className="date-picker-wrapper">
                    <label>Check Out</label>
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
                      placeholderText="Select check-out date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>

                <div className="guest-container">
                  <div className="guest-div">
                    <label>Adults</label>
                    <div className="number-input-wrapper">
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
                  </div>

                  <div className="guest-div">
                    <label>Children</label>
                    <div className="number-input-wrapper">
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
                  </div>
                </div>

                {showCheckButton ? (
                  <Button
                    className="check-availability-btn"
                    onClick={handleConfirmBooking}
                  >
                    Check Availability & Price
                  </Button>
                ) : (
                  totalPrice > 0 && (
                    <div className="booking-summary">
                      <div className="price-breakdown">
                        <p>
                          Room Rate: ${roomDetails.roomPrice} ×{" "}
                          {Math.round(
                            (new Date(checkOutDate) - new Date(checkInDate)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          nights
                        </p>
                        <p className="total-amount">Total: ${totalPrice}</p>
                      </div>
                      <Button
                        className="confirm-booking-btn"
                        onClick={acceptBooking}
                      >
                        Confirm Reservation
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
