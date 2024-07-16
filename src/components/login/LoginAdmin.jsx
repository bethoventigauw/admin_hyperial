import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoginAdmin.css';

function Login() {
  const [values, setValues] = useState({
    Email: '',
    Password: '',
  });
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values); // Print values to ensure data is being sent

    axios.post('https://backend.hyperial.my.id/authen/adminLogin', values) // Updated URL for admin login
      .then(res => {
        console.log(res.data); // Print response from server
        if (res.data.valid) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role); // Store user role

          if (res.data.role === 'admin') {
            navigate('/dashboard'); // Navigate to admin dashboard
          } else {
            alert("Not authorized as admin.");
          }
        } else {
          alert("Invalid credentials. Please try again.");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Admin Login</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={values.Email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              value={values.Password}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="back-to-landing">
          <Link to="https://hyperial.my.id/" onClick={() => console.log('Navigating to LandingPage')}>
            Back to LandingPage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
