import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editRoomPage.css";
import Button from "../../component/Button";
import Modal from "../../component/Modal";
import FormGroup from "../../component/FormGroup";
import Loading from "../../component/Loading";

const EditRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails({
          roomPhotoUrl: response.room.roomPhotoUrl,
          roomType: response.room.roomType,
          roomPrice: response.room.roomPrice,
          roomDescription: response.room.roomDescription,
        });

        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setIsLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("roomType", roomDetails.roomType);
      formData.append("roomPrice", roomDetails.roomPrice);
      formData.append("roomDescription", roomDetails.roomDescription);

      if (file) {
        formData.append("photo", file);
      }

      setIsLoading(true);
      const result = await ApiService.updateRoom(roomId, formData);
      if (result.statusCode === 200) {
        setSuccess("Room updated successfully.");

        setTimeout(() => {
          setSuccess("");
          navigate("/admin/manage-rooms");
        }, 3000);
      }
      setIsLoading(false);
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setIsLoading(false);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this room?")) {
      try {
        setIsLoading(true);
        const result = await ApiService.deleteRoom(roomId);
        if (result.statusCode === 200) {
          setSuccess("Room Deleted successfully.");

          setTimeout(() => {
            setSuccess("");
            navigate("/admin/manage-rooms");
          }, 3000);
        }
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setTimeout(() => setError(""), 5000);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="edit-room-container">
      {isLoading && <Loading message="Loading room..." />}
      <h2>Edit Room</h2>
      {error && (
        <Modal type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Modal
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}
      <div className="edit-room-form">
        <FormGroup>
          {preview ? (
            <img
              src={preview}
              alt="Room Preview"
              className="room-photo-preview"
            />
          ) : (
            roomDetails.roomPhotoUrl && (
              <img
                src={roomDetails.roomPhotoUrl}
                alt="Room"
                className="room-photo"
              />
            )
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
        </FormGroup>

        <FormGroup label="Room Type">
          <select
            name="roomType"
            value={roomDetails.roomType}
            onChange={handleChange}
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.displayName}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="Room Price">
          <input
            type="number"
            name="roomPrice"
            value={roomDetails.roomPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </FormGroup>

        <FormGroup label="Room Description">
          <textarea
            name="roomDescription"
            value={roomDetails.roomDescription}
            onChange={handleChange}
          ></textarea>
        </FormGroup>

        <div className="button-container">
          <Button onClick={handleUpdate}>Update Room</Button>
          <Button className="danger" onClick={handleDelete}>
            Delete Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomPage;
