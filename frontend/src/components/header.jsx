import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on component mount or on any login/logout
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token); // Set true if token exists, otherwise false
  }, []); // Empty dependency array ensures this effect only runs once on mount

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // Remove the token
    setIsLoggedIn(false); // Update state to reflect user is logged out
    navigate("/login"); // Redirect to login page after logging out
  };

  return (
    <header className="flex items-center justify-between p-4 text-white bg-gray-800">
      <div className="text-xl">
        <Link to="/" className="font-bold text-white">My Book Review Platform</Link>
      </div>
      <div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-white">Profile</Link>
            <button onClick={handleLogout} className="text-white">Logout</button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white">Login</Link>
            <Link to="/register" className="text-white">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
