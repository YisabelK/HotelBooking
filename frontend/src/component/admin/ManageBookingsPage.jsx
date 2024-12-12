import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import "./manageBookingsPage.css";
import Button from "../../utils/Button";
import Field from "../../utils/Field";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(6);
  const navigate = useNavigate();

  const filterBookings = useCallback(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.bookingConfirmationCode &&
          booking.bookingConfirmationCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
    setCurrentPage(1);
  }, [bookings, searchTerm]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();
        const allBookings = response.bookingList;
        setBookings(allBookings);
        setFilteredBookings(allBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookings-container">
      <h2>All Bookings</h2>
      <div className="search-div">
        <label>Filter by Booking Number:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter booking number"
        />
      </div>

      <div className="booking-results">
        {currentBookings.map((booking) => (
          <div key={booking.id} className="booking-result-item">
            <div className="booking-item-info">
              <Field
                label="Booking Code"
                value={booking.bookingConfirmationCode}
              />
              <Field label="Total Guests" value={booking.totalNumOfGuest} />
            </div>
            <div className="booking-item-date">
              <Field label="Check In Date" value={booking.checkInDate} />
              <Field label="Check out Date" value={booking.checkOutDate} />
            </div>
            <div className="booking-item-button">
              <Button
                onClick={() =>
                  navigate(
                    `/admin/edit-booking/${booking.bookingConfirmationCode}`
                  )
                }
              >
                Manage Booking
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        roomsPerPage={bookingsPerPage}
        totalRooms={filteredBookings.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageBookingsPage;
