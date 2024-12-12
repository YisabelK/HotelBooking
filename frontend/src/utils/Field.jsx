import React from "react";

const Field = ({ label, value }) => {
  return value ? (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  ) : null;
};

export default Field;
