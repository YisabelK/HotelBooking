import React from "react";
import { Link } from "react-router-dom";
import Field from "./Field";
import "./bookingResult.css";
import ApiService from "../service/ApiService";

const BookingResult = ({ bookingSearchResults }) => {
  const isAdmin = ApiService.isAdmin();
  return (
    <div className="booking-code-results-container">
      {bookingSearchResults.map((booking) => (
        <div key={booking.id} className="booking-code-result-item">
          <Field label="Booking Code" value={booking.bookingConfirmationCode} />
          <Field label="Check In" value={booking.checkInDate} />
          <Field label="Check Out" value={booking.checkOutDate} />
          <Field label="Status" value={booking.status} />
          {isAdmin && (
            <div className="form-button-container">
              <Link
                to={`/admin/edit-booking/${booking.bookingConfirmationCode}`}
                className="manage-booking-link"
              >
                Manage This Booking
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingResult;
