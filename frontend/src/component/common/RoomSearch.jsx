import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiService from "../../service/ApiService";
import "./roomSearch.css";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";
const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoading(true);
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room types:", error.message);
        setIsLoading(false);
      }
    };
    fetchRoomTypes();
  }, []);

  if (isLoading) {
    return <Loading message="Loading room types..." />;
  }

  const showError = (message, timeout = 5000) => {
    setError(message);
    setShowModal(true);
    setTimeout(() => {
      setError("");
      setShowModal(false);
    }, timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Please select all fields");
      return false;
    }
    try {
      const formattedStartDate = startDate
        ? startDate.toISOString().split("T")[0]
        : null;
      const formattedEndDate = endDate
        ? endDate.toISOString().split("T")[0]
        : null;
      const response = await ApiService.getAvailableRoomsByDateAndType(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError(
            "Room not currently available for this date range on the selected rom type."
          );
          return;
        }
        handleSearchResult(response.roomList);
        setError("");
      }
    } catch (error) {
      showError("Unown error occured: " + error.response.data.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  return (
    <section>
      <div className="search-container">
        <div className="search-field">
          <label>Check-in Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-in Date"
          />
        </div>
        <div className="search-field">
          <label>Check-out Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-out Date"
          />
        </div>

        <div className="search-field">
          <label>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option disabled value="">
              Select Room Type
            </option>
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.displayName}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleInternalSearch}>Search Rooms</Button>
      </div>
      {showModal && (
        <Modal type="error" message={error} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default RoomSearch;
