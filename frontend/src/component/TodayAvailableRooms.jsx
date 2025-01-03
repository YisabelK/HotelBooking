import { useState, useEffect } from "react";
import "./todayAvailableRooms.css";
import ApiService from "../service/ApiService";
import Loading from "./Loading";

const TodayAvailableRooms = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getAllRooms();
        const repeatedRooms = [
          ...response.roomList,
          ...response.roomList,
          ...response.roomList,
        ];
        setAllRooms(repeatedRooms);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (allRooms.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= allRooms.length / 3) {
            return 0;
          }
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [allRooms.length]);

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  return (
    <div className="room-slider-container">
      <h2>Today Available Rooms</h2>
      <div className="room-slider-wrapper">
        <div
          className="room-slider"
          style={{
            transform: `translateX(-${currentIndex * 320}px)`,
            transition:
              currentIndex === 0 ? "none" : "transform 0.5s ease-in-out",
          }}
        >
          {allRooms.map((room, index) => (
            <div key={index} className="room-slide">
              <img src={room.roomPhotoUrl} alt={room.roomType} />
              <div className="room-slide-content">
                <h3>{room.roomType}</h3>
                <p>
                  <span className="room-price">${room.roomPrice}</span> / night
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayAvailableRooms;
