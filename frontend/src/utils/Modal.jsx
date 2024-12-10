import React from "react";
import "./modal.css";

const Modal = ({ type = "error", message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}-modal`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;
