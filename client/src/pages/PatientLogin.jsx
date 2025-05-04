import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'; // Same login styling

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");

        // Store patientId and any other required data in localStorage
        // CORRECTED: Store patient ID from the response data
        localStorage.setItem('patientId', data.patient.id);
        // localStorage.setItem('patientToken', data.token); // If you need to store the token

        navigate("/dashboard/patient"); // Redirect to Patient Dashboard
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

       

        <button type="submit">Login</button>

        <div className="login-links">
          
          <a href="/register/patient">New to MediMeet? Register Here</a>
        </div>
      </form>
    </div>
  );
};

export default PatientLogin;
