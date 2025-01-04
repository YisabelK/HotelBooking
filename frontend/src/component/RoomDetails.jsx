import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../service/ApiService";
import "./roomDetails.css";
import Modal from "../component/Modal";
import Loading from "../component/Loading";
import AlarmIcon from "@mui/icons-material/Alarm";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import BathtubIcon from "@mui/icons-material/Bathtub";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import LuggageIcon from "@mui/icons-material/Luggage";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TvIcon from "@mui/icons-material/Tv";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

const RoomDetails = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleCloseError = () => {
    setErrorMessage("");
  };

  if (isLoading) {
    return <Loading message="Loading room details..." />;
  }

  if (error) {
    return <Modal message={error} onClose={() => setError("")} />;
  }

  if (!roomDetails) {
    return <p className="room-detail-loading">Room not found.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, roomDescription } = roomDetails;

  return (
    <div className="room-details-container">
      {errorMessage && (
        <Modal type="error" message={errorMessage} onClose={handleCloseError} />
      )}

      <div className="room-details-hero">
        <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
        <div className="room-details-overlay">
          <h1>{roomType}</h1>
          <div className="price-tag">
            <span className="price">${roomPrice}</span>
            <span className="per-night">per night</span>
          </div>
        </div>
      </div>

      <div className="room-details-content">
        <div className="room-details-main">
          <div className="room-description">
            <h2>Room Overview</h2>
            <p>{roomDescription}</p>
          </div>

          <div className="room-features">
            <h2>
              Room Features <BedroomParentIcon />
            </h2>
            <div className="features-grid">
              <div className="feature-item">
                <WifiIcon />
                <span>High-Speed WiFi</span>
              </div>
              <div className="feature-item">
                <AcUnitIcon />
                <span>Climate Control</span>
              </div>
              <div className="feature-item">
                <TvIcon />
                <span>Smart TV</span>
              </div>
              <div className="feature-item">
                <LocalCafeIcon />
                <span>Coffee Maker</span>
              </div>
            </div>
          </div>

          <div className="room-amenities">
            <h2>
              Room Amenities <BathtubIcon />
            </h2>
            <div className="amenities-list">
              <ul>
                <li>Premium Bath Products</li>
                <li>Luxury Linens</li>
                <li>Mini Bar</li>
                <li>Safe Deposit Box</li>
                <li>24/7 Room Service</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="room-policies">
          <div className="policy-section">
            <h2>
              Check-in/Check-out <AlarmIcon />
            </h2>
            <ul>
              <li>
                <strong>Check-in:</strong> From 3:00 PM
              </li>
              <li>
                <strong>Check-out:</strong> Until 12:00 PM
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>
              Cancellation Policy <PriceCheckIcon />
            </h2>
            <ul>
              <li>
                Free cancellation{" "}
                <span className="phegon-color-red">up to 24 hours</span> before
                check-in
              </li>
              <li>
                Late cancellation or no-show will be charged one night's stay
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
