import React, { useState } from "react";
import DetailsSection from "./DetailsSection";
import "./bookingDetailsPage.css";

const BookingDetailPage = ({ bookingDetails }) => {
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

  return (
    <div className="booking-details-container">
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
  );
};

export default BookingDetailPage;
