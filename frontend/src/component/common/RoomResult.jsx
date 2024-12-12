import React from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./roomResult.css";
import Button from "../../utils/Button";

const RoomResult = ({ roomSearchResults }) => {
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();
  return (
    <section className="room-results">
      {roomSearchResults && roomSearchResults.length > 0 && (
        <div className="room-list">
          {roomSearchResults.map((room) => (
            <div key={room.id} className="room-list-item">
              <img
                className="room-list-item-image"
                src={room.roomPhotoUrl}
                alt={room.roomType}
              />
              <div className="room-details">
                <h3>{room.roomType}</h3>
                <p>Price: ${room.roomPrice} / night</p>
                <p>Description: {room.roomDescription}</p>
              </div>

              <div className="book-now-div">
                {isAdmin ? (
                  <Button
                    onClick={() => navigate(`/admin/edit-room/${room.id}`)} 
                  >
                    Edit Room
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate(`/room-details-book/${room.id}`)}
                  >
                    View/Book Room
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RoomResult;
