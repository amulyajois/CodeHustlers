import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/PatientRegister.css';

const RegisterPatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Function to check password strength
  const isStrongPassword = (password) => {
    // Correct regex pattern
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    return regex.test(password);
  };

  // Function to check password strength for password meter
  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    if (isStrongPassword(password)) return "Strong";
    return "Medium";
  };

  // Function to sanitize input
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.innerText = input;
    return div.innerHTML;
  };

  // Function to validate email properly
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Update password strength when password or confirmPassword changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Empty field validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please provide a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError("Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character.");
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must agree to the terms and privacy policy");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login/patient"); 
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="logo">MediMeet</h2>
        <h3>PATIENT REGISTRATION</h3>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        {/* Password Strength Meter */}
        {formData.password && (
          <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
            {passwordStrength}
          </div>
        )}

        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <label htmlFor="terms">
  I agree to the <a href="/terms.html"  rel="noopener noreferrer">terms and privacy policy</a>
</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>Already have an account? <a href="/login/patient">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterPatient;
