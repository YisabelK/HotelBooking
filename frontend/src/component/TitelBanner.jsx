import "./titelBanner.css";

const TitelBanner = ({ title, image, imageFormat }) => {
  return (
    <div className="banner-section">
      <img src={`/assets/images/${image}.${imageFormat}`} alt={image} />
      <h2>{title}</h2>
    </div>
  );
};

export default TitelBanner;
