import React, { useState, useEffect } from "react";
import ApiService from "../service/ApiService";
import Pagination from "../component/Pagination";
import RoomResult from "../component/RoomResult";
import RoomSearch from "../component/RoomSearch";
import "./roomReservationPage.css";
import Loading from "../component/Loading";
import TitelBanner from "../component/TitelBanner";

const RoomReservationPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResult = (results) => {
    setRooms(results);
    setFilteredRooms(results);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
        setIsLoading(false);
      }
    };

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

    fetchRooms();
    fetchRoomTypes();
  }, []);

  if (isLoading) {
    return <Loading message="Loading rooms..." />;
  }

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
    filterRooms(e.target.value);
  };

  const filterRooms = (type) => {
    if (type === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === type);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="all-rooms">
      <TitelBanner title="Reservation" image="clean" imageFormat="jpg" />

      <div className="all-room-filter-div">
        <label>Filter by Room Type:</label>
        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
          <option value="">All</option>
          {roomTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.displayName}
            </option>
          ))}
        </select>
      </div>
      {/* 
      <div className="search-section"> */}
      <RoomSearch handleSearchResult={handleSearchResult} />
      {/* </div> */}
      <div className="results-section">
        <RoomResult roomSearchResults={currentRooms} />
      </div>

      <div className="pagination-section">
        <Pagination
          roomsPerPage={roomsPerPage}
          totalRooms={filteredRooms.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default RoomReservationPage;
