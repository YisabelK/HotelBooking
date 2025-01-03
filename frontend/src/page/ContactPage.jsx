import React, { useState } from "react";
import "./contactPage.css";
import Button from "../component/Button";
import Modal from "../component/Modal";
import FormGroup from "../component/FormGroup";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          to_name: "Han Hotels and Resorts || Yoomi Kim",
          from_email: formData.email,
          to_email: "isabelyumi37@gmail.com",
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setSubmitStatus("Thank you for your message 😃");

          setTimeout(() => {
            setSubmitStatus("");
            setFormData({
              name: "",
              email: "",
              subject: "",
              message: "",
            });
          }, 3000);
        },
        (error) => {
          setLoading(false);
          setSubmitStatus("Failed to send message 😢");
          console.error("Email error:", error);
        }
      );
  };

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      <div className="contact-form">
        <h2>Did you like my portfolio?</h2>
        <p>
          If you have any questions, feel free to reach out to me via email!
        </p>
        {submitStatus && <Modal title="Success" message={submitStatus} />}
        <form onSubmit={handleSubmit}>
          <FormGroup label="Name">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="your name"
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
              placeholder="your email"
            />
          </FormGroup>
          <FormGroup label="Subject">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="subject"
            />
          </FormGroup>
          <FormGroup label="Message">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={1000}
              placeholder="Please share your thoughts!"
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
