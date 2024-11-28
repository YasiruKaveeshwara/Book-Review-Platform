import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in when the page loads
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Invalid credentials",
        text: "Please enter your email and password to login.",
      });
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
        localStorage.setItem("userName", data.userName);
        
        Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/"); 
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: data.message || "An error occurred. Please try again.",
        });
        
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Failed to connect to the server. Please try again.",
      });
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            
            <TextField
              label='Email'
              variant='outlined'
              type='email'
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#FFA500",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFA500",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFA500",
                  },
                },
              }}
            />
          </div>
          <div className='mb-4'>
          <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#FFA500",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFA500",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFA500",
                  },
                },
              }}
              label='Password'
              variant='outlined'
              type='password'
              fullWidth
              required
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
