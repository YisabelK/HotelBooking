import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import LoginWelcome from "./LoginWelcome";
import Button from "../../utils/Button";
import Modal from "../../utils/Modal";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";

registerLocale("en-GB", enGB);
function RegisterPage() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    streetName: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    state: "",
    birthDate: "",
    gender: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const { name, email, password, passwordConfirm, phoneNumber } = formData;
    const errors = {
      name: !name,
      email: !email,
      password: !password,
      passwordConfirm: !passwordConfirm,
      phoneNumber: !phoneNumber,
    };

    setValidationErrors(errors);

    if (password !== passwordConfirm && password && passwordConfirm) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorMessage("Please fill all the required fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await ApiService.registerUser(formData);

      if (response.statusCode === 200) {
        setFormData({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
          phoneNumber: "",
          streetName: "",
          houseNumber: "",
          postalCode: "",
          city: "",
          country: "",
          state: "",
          birthDate: "",
          gender: "",
        });
        setSuccessMessage("User registered successfully");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <LoginWelcome />
      <div className="auth-container">
        {errorMessage && (
          <Modal
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
        {successMessage && (
          <Modal
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}
        <h2>Register online account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={validationErrors.name ? "error-input" : ""}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
              className={validationErrors.passwordConfirm ? "error-input" : ""}
            />
            {validationErrors.passwordConfirm && (
              <span className="error-text">Passwords do not match</span>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="address-group">
            <h3>Address Information</h3>
            <div className="address-row">
              <div className="form-group street-name">
                <label>Address:</label>
                <input
                  type="text"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group house-number">
                <label>House No:</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="location-row">
              <div className="form-group">
                <label>Postal Code:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="location-row">
              <div className="form-group">
                <label>Country:</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="birth-gender-row">
            <div className="form-group">
              <label>Birth Date:</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                locale="en-GB"
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <Button type="submit">Register</Button>
        </form>
        <p className="register-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
