import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home";
import ReviewsIcon from "@mui/icons-material/Reviews";
import MenuBookIcon from '@mui/icons-material/MenuBook';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in when the component mounts or when token changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [localStorage.getItem("authToken")]); 

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 p-4 bg-white shadow-lg backdrop-blur-lg bg-opacity-35'>
      <div className='flex items-center justify-between'>
        <div className='text-xl'>
          <Link to='/' className='font-bold text-[#FFA500]'>
            Book Reviewer
          </Link>
        </div>
        <div className='flex items-center text-[#FFA500]'>
          {isLoggedIn ? (
            <div className='flex items-center'>
              <Link to='/' className='mr-10 hover:text-gray-60 hover:text-gray-600'>
                <HomeIcon className='mx-2' />
                Home
              </Link>
              <Link to='/myReviews' className='mr-10 hover:text-gray-60 hover:text-gray-600'>
                <ReviewsIcon className='mx-2' />
                My Reviews
              </Link>
              <Link to='/addBook' className='mr-52 hover:text-gray-600'>
                <MenuBookIcon className='mx-2' />
                Add Books
              </Link>
              
              <button onClick={handleLogout} className='flex items-center'>
                <LogoutIcon className='mr-2' />
                Logout
              </button>
            </div>
          ) : (
            <div className='flex items-center'>
              <Link to='/login' className='mr-4'>
                <LoginIcon className='mx-2' />
                Login
              </Link>
              <Link to='/register'>
                <AppRegistrationIcon className='mx-2' />
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
