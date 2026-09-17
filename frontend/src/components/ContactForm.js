import React, { useState } from "react";
import './ContactForm.css';
import { FaPaperPlane} from "react-icons/fa"; // Import the icon

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.subject || !formData.message) {
      setStatus("Please fill in all fields.");
      
      // Clear the message after 3 seconds
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("Message sent successfully!");
        setFormData({ email: "", subject: "", message: "" }); // Reset form

        // Clear the message after 3 seconds
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to send message. Try again.");
        
        // Clear the message after 3 seconds
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Something went wrong. Try again later.");
      
      // Clear the message after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    }
};


  return (
    <section className="contact-section">
      <h2>✉️ Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">
        <i><FaPaperPlane className="ai-icon" /> </i>Send Message
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
};

export default ContactForm;
