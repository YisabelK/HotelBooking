import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../service/ApiService";
import "./loginRegisterPage.css";
import WelcomeMessage from "../component/WelcomeMessage";
import Button from "../component/Button";
import Modal from "../component/Modal";
import FormGroup from "../component/FormGroup";
import Loading from "../component/Loading";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const response = await ApiService.loginUser({ email, password });
      if (response.statusCode === 200) {
        setIsLoading(true);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("role", response.role);
        navigate(from, { replace: true });
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(""), 5000);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading login..." />;
  }

  return (
    <>
      <WelcomeMessage />
      <div className="auth-container">
        <h2>Login</h2>
        {error && (
          <Modal type="error" message={error} onClose={() => setError(null)} />
        )}
        <form onSubmit={handleSubmit}>
          <FormGroup label="Email:">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </FormGroup>
          <FormGroup label="Password:">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </FormGroup>
          <div className="form-button-container">
            <Button type="submit">Login</Button>
          </div>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
