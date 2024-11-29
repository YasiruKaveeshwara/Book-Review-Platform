import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: data.message || "An error occurred. Please try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <TextField
              label='userName'
              variant='outlined'
              fullWidth
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
