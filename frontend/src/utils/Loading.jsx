import React from "react";
import "./loading.css";

const Loading = ({ message }) => {
  return (
    <div className="loading-container">
      <h2>{message}...</h2>
      <img src="/assets/images/Spinner.gif" alt="Spinner" />
    </div>
  );
};
export default Loading;
