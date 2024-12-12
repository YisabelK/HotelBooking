import React from "react";
import "./button.css";

const Button = ({
  onClick,
  children,
  variant = "primary", // primary, danger
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`custom-button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
