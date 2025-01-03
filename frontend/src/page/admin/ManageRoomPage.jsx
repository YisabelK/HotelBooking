import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../../component/Pagination";
import RoomResult from "../../component/RoomResult";
import Button from "../../component/Button";
import "./manageRoomPage.css";
import Loading from "../../component/Loading";
const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  //Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="all-rooms">
      {isLoading && <Loading message="Loading rooms..." />}
      <h2>All Rooms</h2>
      <div className="all-room-filter-div">
        <div className="filter-select-div">
          <label>Filter by Room Type:</label>
          <select value={selectedRoomType} onChange={handleRoomTypeChange}>
            <option value="">All</option>
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.displayName}
              </option>
            ))}
          </select>

          <Button onClick={() => navigate("/admin/add-room")}>
            Add New Room
          </Button>
        </div>
      </div>

      <RoomResult roomSearchResults={currentRooms} />

      <Pagination
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageRoomPage;
