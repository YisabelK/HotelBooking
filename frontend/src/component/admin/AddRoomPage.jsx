import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
import "./addRoomPage.css";

const AddRoomPage = () => {
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    roomPhotoUrl: "",
    roomType: "",
    roomPrice: "",
    roomDescription: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState(false);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error("Error fetching room types:", error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoomTypeChange = (e) => {
    if (e.target.value === "new") {
      setNewRoomType(true);
      setRoomDetails((prevState) => ({ ...prevState, roomType: "" }));
    } else {
      setNewRoomType(false);
      setRoomDetails((prevState) => ({
        ...prevState,
        roomType: e.target.value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleCloseSuccess = () => {
    setSuccess("");
    navigate("/admin/manage-rooms");
  };

  const addRoom = async () => {
    if (
      !roomDetails.roomType ||
      !roomDetails.roomPrice ||
      !roomDetails.roomDescription
    ) {
      setError("All room details must be provided.");
      return;
    }

    if (!window.confirm("Do you want to add this room?")) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("roomType", roomDetails.roomType);
      formData.append("roomPrice", roomDetails.roomPrice);
      formData.append("roomDescription", roomDetails.roomDescription);

      if (file) {
        formData.append("photo", file);
      }

      const result = await ApiService.addRoom(formData);
      if (result.statusCode === 200) {
        setSuccess("Room Added successfully.");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="add-room-container">
      <h2>Add New Room</h2>
      {error && (
        <Modal type="error" message={error} onClose={handleCloseError} />
      )}
      {success && (
        <Modal type="success" message={success} onClose={handleCloseSuccess} />
      )}
      <div className="add-room-form">
        <div className="form-group">
          {preview && (
            <img
              src={preview}
              alt="Room Preview"
              className="room-photo-preview"
            />
          )}
          <input
            type="file"
            name="roomPhoto"
            onChange={handleFileChange}
            id="room-photo-input"
            className="hidden-file-input"
          />
          <label htmlFor="room-photo-input" className="file-upload-button">
            Choose Photo
          </label>
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
            <option value="">Select a room type</option>
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.displayName}
              </option>
            ))}
            <option value="new">Other (please specify)</option>
          </select>
          {newRoomType && (
            <input
              type="text"
              name="roomType"
              placeholder="Enter new room type"
              value={roomDetails.roomType}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="form-group">
          <label>Room Price</label>
          <input
            type="text"
            name="roomPrice"
            value={roomDetails.roomPrice}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Room Description</label>
          <textarea
            name="roomDescription"
            value={roomDetails.roomDescription}
            onChange={handleChange}
          ></textarea>
        </div>
        <Button className="update-button" onClick={addRoom}>
          Add Room
        </Button>
      </div>
    </div>
  );
};

export default AddRoomPage;
