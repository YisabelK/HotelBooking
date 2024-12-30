import React from "react";
import { Link } from "react-router-dom";
import Field from "../ui/Field";
import "./bookingResult.css";
import ApiService from "../../service/ApiService";

const BookingResult = ({ bookingSearchResults }) => {
  const isAdmin = ApiService.isAdmin();
  return (
    <div className="booking-results">
      {bookingSearchResults.map((booking) => (
        <div key={booking.id} className="booking-result-item">
          <Field label="Booking Code" value={booking.bookingConfirmationCode} />
          <Field label="Check In" value={booking.checkInDate} />
          <Field label="Check Out" value={booking.checkOutDate} />
          {isAdmin && (
            <Link
              to={`/admin/edit-booking/${booking.bookingConfirmationCode}`}
              className="edit-link"
            >
              Edit Booking
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingResult;
