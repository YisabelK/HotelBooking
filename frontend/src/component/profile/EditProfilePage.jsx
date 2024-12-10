import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "./editProfilePage.css";
import Button from "../../utils/Button";

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    streetName: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    birthDate: "",
    gender: "",
  });
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
        setFormData({
          name: response.user.name || "",
          email: response.user.email || "",
          phoneNumber: response.user.phoneNumber || "",
          streetName: response.user.streetName || "",
          houseNumber: response.user.houseNumber || "",
          postalCode: response.user.postalCode || "",
          city: response.user.city || "",
          state: response.user.state || "",
          country: response.user.country || "",
          birthDate: response.user.birthDate?.split("T")[0] || "",
          gender: response.user.gender || "",
        });
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

        // If no country is selected, set Germany as default
        if (!formData.country) {
          setFormData((prev) => ({
            ...prev,
            country: "DE",
          }));
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to edit your profile.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        streetName: formData.streetName || "",
        houseNumber: formData.houseNumber || "",
        postalCode: formData.postalCode || "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        birthDate: formData.birthDate || "",
        gender: formData.gender || "",
      };

      console.log("Sending update data:", updateData);
      const updatedUser = await ApiService.updateProfile(updateData);

      setSuccess("Profile updated successfully!");
      setUser(updatedUser);

      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response?.status === 403) {
        setError("세션이 만료되었습니다. 다시 로그인해주세요.");
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

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="address-group">
          <h3>Address Details</h3>

          <div className="address-row">
            <div className="form-group street-name">
              <label htmlFor="streetName">Address:</label>
              <input
                type="text"
                id="streetName"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group house-number">
              <label htmlFor="houseNumber">House No:</label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="location-row">
            <div className="form-group postal-code">
              <label htmlFor="postalCode">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group city">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group state">
              <label htmlFor="state">State/Province:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              name="country"
              value={formData.country}
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
          </div>
        </div>

        <div className="birth-gender-row">
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date:</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" className="update-profile-button">
            Update Profile
          </Button>
          <Button
            type="button"
            className="delete-profile-button"
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
