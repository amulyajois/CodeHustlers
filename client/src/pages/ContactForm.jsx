






import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContactForm.css'; // Ensure correct path to the CSS file

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus(res.data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('Failed to send message');
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
        <button type="submit">Send</button>
      </form>
      {status && <p className={status.includes('Failed') ? 'error' : ''}>{status}</p>}
    </div>
  );
};

export default ContactForm;
