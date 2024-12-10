import React, { useEffect } from "react";
import "./about.css";

const AboutPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      }
    );

    // 모든 텍스트 요소를 관찰
    document
      .querySelectorAll(
        ".about-intro p, .experience-content p, .dining-content p, .staff-content p, .resort-item p"
      )
      .forEach((el) => {
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      <h1>About The Han Hotels & Resorts</h1>

      <section className="about-intro">
        <img src="/assets/images/hotel2.jpg" alt="The Han Hotel Exterior" />
        <p>
          Founded in 1973, The Han Hotels & Resorts has been a symbol of German
          luxury hospitality for over 50 years. With our flagship properties in
          Berlin and Cologne, we combine traditional German elegance with modern
          comfort.
        </p>
      </section>

      <section className="about-experience">
        <h2>Experience The Han</h2>
        <div className="experience-content">
          <img
            src="/assets/images/enjoy.jpg"
            alt="Guests enjoying their stay"
          />
          <p>
            At The Han Hotels & Resorts, every moment is crafted to create
            unforgettable memories. From our luxurious accommodations to
            world-class amenities, we ensure your stay is nothing short of
            extraordinary.
          </p>
        </div>
      </section>

      <section className="about-resorts">
        <h2>Our Distinguished Resorts</h2>
        <div className="resort-grid">
          <div className="resort-item">
            <img src="/assets/images/resort.jpg" alt="The Han Berlin Resort" />
            <h3>The Han Berlin</h3>
            <p>
              Located in the heart of Berlin, our Berlin property offers a
              perfect blend of urban sophistication and traditional German
              hospitality. Featuring spectacular city views and easy access to
              Berlin's vibrant culture.
            </p>
          </div>
          <div className="resort-item">
            <img
              src="/assets/images/resort2.jpg"
              alt="The Han Cologne Resort"
            />
            <h3>The Han Cologne</h3>
            <p>
              Nestled in the natural beauty of Cologne, this resort offers a
              peaceful retreat with stunning ocean views. Experience the perfect
              harmony of luxury and nature in our island paradise.
            </p>
          </div>
        </div>
      </section>

      <section className="about-dining">
        <h2>Exceptional Dining</h2>
        <div className="dining-content">
          <img
            src="/assets/images/restaurant.jpg"
            alt="Luxury dining experience"
          />
          <p>
            Our restaurants offer an extraordinary culinary journey, featuring
            both traditional German cuisine and international flavors. Each dish
            is crafted with precision by our award-winning chefs using the
            finest seasonal ingredients.
          </p>
        </div>
      </section>

      <section className="about-staff">
        <h2>Our Dedicated Team</h2>
        <div className="staff-content">
          <img
            src="/assets/images/reception.jpg"
            alt="Professional hotel staff"
          />
          <p>
            The heart of The Han experience lies in our exceptional staff. Our
            team of dedicated professionals is committed to providing
            personalized service that exceeds expectations, ensuring every guest
            feels truly valued and cared for.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
