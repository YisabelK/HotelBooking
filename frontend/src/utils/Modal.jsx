import React from "react";
import "./modal.css";
import Button from "./Button";

const Modal = ({ type = "error", message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}-modal`}>
        <p>{message}</p>
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
};

export default Modal;
