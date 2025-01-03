import React, { useState} from "react";
import RoomResult from "../component/RoomResult";
import RoomSearch from "../component/RoomSearch";
import "./homePage.css";
import LocationMap from "../component/LocationMap";
import Modal from "../component/Modal";
import openingHoursContent from "../utils/openingHours";
import HeaderBanner from "../component/HeaderBanner";
import TodayAvailableRooms from "../component/TodayAvailableRooms";

const HomePage = () => {
  const [roomSearchResults, setRoomSearchResults] = useState([]);
  const [showOpeningHours, setShowOpeningHours] = useState(false);

  const handleSearchResult = (results) => {
    setRoomSearchResults(results);
  };

  return (
    <div className="home-container">
      {showOpeningHours && (
        <Modal
          type="text"
          title="Our Opening Hours"
          message={openingHoursContent}
          onClose={() => setShowOpeningHours(false)}
        />
      )}
      <HeaderBanner />

      <div className="home-search-container">
        <h2>Find your room</h2>
        <RoomSearch handleSearchResult={handleSearchResult} />
        <RoomResult roomSearchResults={roomSearchResults} />
      </div>

      <TodayAvailableRooms />
      <h2 className="home-services">
        Services at{" "}
        <span className="phegon-color">The Han Hotels & Resorts</span>
      </h2>
      <br />
      <p className="services-description">
        Experience the enchantment of luxury hospitality at The Han. From our
        exquisite dining experiences to tranquil spa retreats, every moment is
        crafted to create timeless memories. Discover a world where elegance
        meets comfort, and every stay becomes an extraordinary journey.
      </p>

      <section className="service-section">
        <div className="service-card">
          <div
            className="service-image"
            style={{ backgroundImage: "url(./assets/images/ac.jpg)" }}
          >
            <h3 className="service-title">Air Conditioning</h3>
            <div className="service-overlay">
              <p className="service-description">
                Stay cool and comfortable throughout your stay with our
                individually controlled in-room air conditioning.
              </p>
            </div>
          </div>
        </div>
        <div className="service-card">
          <div
            className="service-image"
            style={{
              backgroundImage:
                "url(./assets/images/breakfast-room-service.jpg)",
            }}
          >
            <h3 className="service-title">Mini Bar</h3>
            <div className="service-overlay">
              <p className="service-description">
                Enjoy a convenient selection of beverages and snacks stocked in
                your room's mini bar with no additional cost.
              </p>
            </div>
          </div>
        </div>
        <div className="service-card">
          <div
            className="service-image"
            style={{ backgroundImage: "url(./assets/images/driving.jpg)" }}
          >
            <h3 className="service-title">Parking</h3>
            <div className="service-overlay">
              <p className="service-description">
                We offer on-site parking for your convenience. Please inquire
                about valet parking options if available.
              </p>
            </div>
          </div>
        </div>
        <div className="service-card">
          <div
            className="service-image"
            style={{ backgroundImage: "url(./assets/images/wifi.jpg)" }}
          >
            <h3 className="service-title">WiFi</h3>
            <div className="service-overlay">
              <p className="service-description">
                Stay connected throughout your stay with complimentary
                high-speed Wi-Fi access available in all guest rooms and public
                areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="journey-container">
        <div className="journey-text">
          <h2>
            Access to{" "}
            <span className="phegon-color">The Han Hotels & Resorts</span>
          </h2>
          <p>
            Han Hotel is easily accessible by car and public transportation
            (closest stop: Cologne Central Station, "Dom/Hbf"). It is located
            near the Cologne Cathedral and is easy to spot due to its modern and
            striking architecture. Please visit us during{" "}
            <span
              className="clickable"
              onClick={() => setShowOpeningHours(true)}
            >
              our opening hours
            </span>
            .
          </p>
          <h3>Barrier-Free Access to Han Hotel</h3>
          <p>
            For wheelchair users, the hotel's main entrance on Hanstraße offers
            a barrier-free pathway. The lobby, guest rooms, and all facilities
            are designed to be wheelchair accessible. Should you require
            assistance, please do not hesitate to contact our staff at the front
            desk. For more information on accessible features, visit
            Accessibility.
          </p>
        </div>
        <LocationMap />
      </div>
    </div>
  );
};

export default HomePage;
