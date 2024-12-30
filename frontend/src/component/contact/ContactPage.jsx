import React, { useState } from "react";
import "./contact.css";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import FormGroup from "../ui/FormGroup";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus("Thank you for your message. We will contact you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setTimeout(() => setSubmitStatus(""), 5000);
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-form">
        <h2>Send us a Message</h2>
        {submitStatus && <Modal title="Success" message={submitStatus} />}
        <form onSubmit={handleSubmit}>
          <FormGroup label="Name">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup label="Email">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup label="Subject">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup label="Message">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </FormGroup>
          <div className="form-button-container">
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
