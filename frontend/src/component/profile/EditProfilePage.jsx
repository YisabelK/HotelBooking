import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editProfilePage.css";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
import FormGroup from "../../utils/FormGroup";

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getUserProfile();
        console.log("Fetched user data:", response.user);
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data
          .map((country) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);

        if (user && !user.country) {
          setUser((prev) => ({
            ...prev,
            country: "DE",
          }));
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Please login to edit your profile.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      const updatedUser = await ApiService.updateProfile(user);
      setSuccess("Profile updated successfully!");
      setUser(updatedUser);

      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          ApiService.logout();
          navigate("/login");
        }, 2000);
      } else {
        setError(error.response?.data?.message || error.message);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    try {
      await ApiService.deleteUser(user.id);
      navigate("/signup");
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {error && (
        <Modal type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Modal
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <FormGroup label="Name:">
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Email:">
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Phone Number:">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="address-group">
          <h3>Address Details</h3>
          <div className="row-flex">
            <FormGroup label="Address:" className="flex-3">
              <input
                type="text"
                id="streetName"
                name="streetName"
                value={user.streetName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="House No:" className="flex-1">
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={user.houseNumber}
                onChange={handleChange}
              />
            </FormGroup>
          </div>

          <div className="row-flex">
            <FormGroup label="Postal Code:" className="flex-1">
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={user.postalCode}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="City:" className="flex-1">
              <input
                type="text"
                id="city"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="input-field"
              />
            </FormGroup>
          </div>

          <div className="row-flex">
            <FormGroup label="State:" className="flex-1">
              <input
                type="text"
                id="state"
                name="state"
                value={user.state}
                onChange={handleChange}
                className="input-field"
              />
            </FormGroup>
            <FormGroup label="Country:" className="flex-1">
              <select
                id="country"
                name="country"
                value={user.country}
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>
        </div>

        <div className="row-flex">
          <FormGroup label="Birth Date:" className="flex-1">
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={user.birthDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup label="Gender:" className="flex-1">
            <select
              id="gender"
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </FormGroup>
        </div>

        <div className="form-actions">
          <Button type="submit">Update Profile</Button>
          <Button
            type="button"
            className="danger"
            onClick={handleDeleteProfile}
          >
            Delete Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
