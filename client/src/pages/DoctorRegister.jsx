import React, { useState, useEffect } from "react";
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

  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hospital/all");
        if (!response.ok) throw new Error("Failed to fetch hospitals");
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setError("Failed to load hospitals. Please try again later.");
      }
    };

    fetchHospitals();
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trimStart(),
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Trim form data
    const trimmedFormData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      hospitalName: formData.hospitalName.trim(),
      specialization: formData.specialization.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim()
    };

    if (trimmedFormData.password !== trimmedFormData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(trimmedFormData.password)) {
      setError("Password must be at least 8 characters, with 1 letter, 1 number, and 1 special character.");
      return;
    }

    if (!validateEmail(trimmedFormData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedFormData.termsAccepted) {
      setError("You must agree to the terms.");
      return;
    }

    setLoading(true);

    try {
      const selectedHospital = hospitals.find(hospital => hospital.hospitalName === trimmedFormData.hospitalName);

      if (!selectedHospital) {
        setError("Selected hospital not found. Please try again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/doctor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: trimmedFormData.name,
          email: trimmedFormData.email,
          hospital: selectedHospital._id,
          specialization: trimmedFormData.specialization,
          password: trimmedFormData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login/doctor");
      } else {
        console.error("Backend error:", data);
        setError(data.message || "Registration failed. Please try again.");
      }

    } catch (err) {
      console.error("Error during registration:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="logo">MediMeet</h2>
        <h3>DOCTOR REGISTRATION</h3>

        {error && <p className="error">{error}</p>}

        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />

        {/* Hospital Selection */}
        <select
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleChange}
          required
          disabled={hospitals.length === 0}
        >
          <option value="">{hospitals.length > 0 ? "Select Hospital" : "Loading hospitals..."}</option>
          {hospitals.map(hospital => (
            <option key={hospital._id} value={hospital.hospitalName}>
              {hospital.hospitalName}
            </option>
          ))}
        </select>

        {/* Specialization Selection */}
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        >
          <option value="">Select Specialization</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Neurology">Neurology</option>
          {/* Add more specializations here */}
        </select>

        {/* Password */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        {/* Terms Acceptance */}
        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
         <label htmlFor="terms">
  I agree to the <a href="/terms.html" rel="noopener noreferrer">terms and privacy policy</a>
</label>

        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>Already have an account? <a href="/login/doctor">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterDoctor;
