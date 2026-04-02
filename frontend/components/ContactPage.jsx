import { useState } from "react"; // Missing import!
import "../../frontend/components/styling/ContactPage.css";

function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      firstName,
      lastName,
      email,
      subject,
      message,
    });
    // Add your form submission logic here
    alert("Message sent successfully!");
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1 className="hero-title">Get in Touch</h1>
        <p className="hero-subtitle">
          Have a question or need help? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-form-section">
            <h2 className="section-title">Send us a Message</h2>
            <p className="section-description">
              Fill out the form below and we'll respond within 24 hours.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="form-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
