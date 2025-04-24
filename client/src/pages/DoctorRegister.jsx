import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/DoctorRegister.css';

const RegisterDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hospitalName: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must agree to the terms");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/doctor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          hospitalName: formData.hospitalName,
          specialization: formData.specialization,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login/doctor");  // redirect to login
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="logo">MediMeet</h2>
        <h3>CREATE AN ACCOUNT</h3>

        {error && <p className="error">{error}</p>}

        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email-address" required />
        <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Hospital name" required />
        
        <select name="specialization" value={formData.specialization} onChange={handleChange} required>
          <option value="">Select Specialization</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
          <option>Pediatrics</option>
          <option>Neurology</option>
        </select>

        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required />

        <div className="terms">
          <input type="checkbox" id="terms" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
          <label htmlFor="terms">
            I agree to the <a href="#">terms and privacy policy</a>
          </label>
        </div>

        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login/doctor">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterDoctor;
