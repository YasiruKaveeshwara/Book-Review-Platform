import React, { useState } from "react";
import { TextField, Button, Alert } from "@mui/material"; // Material UI components
import { useNavigate } from "react-router-dom"; // Updated method for navigation

function RegisterPage() {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); // Updated method for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the alerts
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Redirect to login page or another page on success
        navigate("/login");
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>Register</h2>

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
            <TextField label='userName' variant='outlined' fullWidth required value={userName} onChange={(e) => setuserName(e.target.value)} />
          </div>
          <div className='mb-4'>
            <TextField label='Email' variant='outlined' type='email' fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-4'>
            <TextField
              label='Password'
              variant='outlined'
              type='password'
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
