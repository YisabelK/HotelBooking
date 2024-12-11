import React, { useState, useEffect } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import "./home.css";
import Button from "../../utils/Button";

const bannerData = [
  {
    image: "/assets/images/hotel.jpg",
    title: "The Han Hotels & Resorts",
    subtitle: "Step into a haven of comfort and care",
  },
  {
    image: "/assets/images/hotel-restaurant.jpg",
    title: "Room & Breakfast package for Han members",
    subtitle: "Han members enjoy a 10% discount on room rates",
  },
  {
    image: "/assets/images/hotel-pool.jpg",
    title: "Luxury Pool & Spa",
    subtitle: "Relax and enjoy our luxurious pool and spa",
  },
  {
    image: "/assets/images/cologne-christmas-market.jpeg",
    title: "Cologne Christmas Markets",
    subtitle: "Special Christmas memories to enjoy \n at Han Cologne Hotel",
  },
];

const HomePage = () => {
  const [roomSearchResults, setRoomSearchResults] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchResult = (results) => {
    setRoomSearchResults(results);
  };

  return (
    <div className="home">
      <section>
        <header className="header-banner">
          <img
            src={bannerData[currentBanner].image}
            alt="Han Hotel"
            className="header-image"
          />
          <div className="overlay"></div>
          <div className="animated-texts overlay-content">
            <h1>
              Welcome to
              <br />{" "}
              <span className="phegon-color">
                {bannerData[currentBanner].title}
              </span>
            </h1>
            <br />
            <h3>{bannerData[currentBanner].subtitle}</h3>
          </div>
          <Button
            className="banner-arrow left"
            onClick={() =>
              setCurrentBanner(
                (prev) => (prev - 1 + bannerData.length) % bannerData.length
              )
            }
          >
            &#8249;
          </Button>
          <Button
            className="banner-arrow right"
            onClick={() =>
              setCurrentBanner((prev) => (prev + 1) % bannerData.length)
            }
          >
            &#8250;
          </Button>
          <div className="banner-indicators">
            {bannerData.map((_, index) => (
              <div
                key={index}
                className={`indicator ${
                  index === currentBanner ? "active" : ""
                }`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </header>
      </section>

      <RoomSearch handleSearchResult={handleSearchResult} />
      <RoomResult roomSearchResults={roomSearchResults} />

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
      <section></section>
    </div>
  );
};

export default HomePage;
