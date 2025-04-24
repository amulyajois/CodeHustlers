
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation or API call to check login credentials
    if (email && password) {
      // On successful login, redirect to PatientDashboard
      navigate('/dashboard/patient');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <button type="submit">Login</button>

        <div className="login-links">
          <a href="#">Forgot Password?</a>
          <a href="/register/patient">New to MediMeet? Register Here</a>
        </div>
      </form>
    </div>
  );
};

export default PatientLogin;
