import React, { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in when the page loads
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/"); // Redirect to home page or dashboard
    }

    console.log("Token:", token);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store the JWT token and userName in localStorage
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("userName", data.userName); // Store the userName (if your backend sends it)

        setSuccess(data.message);

        // Redirect to home page or dashboard and refresh header
        navigate("/"); // Redirect to home page or dashboard
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>Login</h2>
        {error && (
          <Alert severity='error' className='mb-4'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity='success' className='mb-4'>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input type='email' placeholder='Email' className='w-full p-2 border rounded' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              placeholder='Password'
              className='w-full p-2 border rounded'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='w-full p-2 text-white bg-orange-500 rounded'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
