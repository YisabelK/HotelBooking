import React, { useState, useEffect } from "react";
import "./headerBanner.css";

import bannerData from "../utils/bannerData";

const HeaderBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section>
      <header className="header-banner">
        <img
          src={bannerData[currentBanner].image}
          alt={bannerData[currentBanner].title}
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
        <button
          className="banner-arrow left"
          onClick={() =>
            setCurrentBanner((prev) => (prev - 1 + bannerData.length) % bannerData.length)
          }
        >
          &#8249;
        </button>
        <button
          className="banner-arrow right"
          onClick={() => setCurrentBanner((prev) => (prev + 1) % bannerData.length)}
        >
          &#8250;
        </button>
        <div className="banner-indicators">
          {bannerData.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentBanner ? "active" : ""}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </header>
    </section>
  );
};

export default HeaderBanner;
