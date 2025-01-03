import React from "react";
import "./detailsSection.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DetailsSection = ({ title, isActive, onToggle, children }) => {
  return (
    <div className="details-section-container">
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        {isActive ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </div>
      <div className={`section-content ${isActive ? "show" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default DetailsSection;
