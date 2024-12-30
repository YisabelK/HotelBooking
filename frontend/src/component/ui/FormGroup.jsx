import React from "react";
import "./formGroup.css";

const FormGroup = ({ label, children, className = "" }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
};

export default FormGroup;
