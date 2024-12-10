import React from "react";
import "./button.css";

const Button = ({
  onClick,
  children,
  variant = "primary", // primary, secondary, danger
  size = "medium", // small, medium, large
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`custom-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
