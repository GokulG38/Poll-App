
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import checkUser from "./utils/checkUser"

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-red-200 text-white p-4">
      <div className="text-xl font-bold text-black">POLL APP</div>
      <div className="flex items-center">
        
        
        <Link to="/home" className="ml-4 text-black">Home</Link>
        <Link to="/mypolls" className="ml-4 text-black">My Polls</Link>
        <Link to="/create" className="ml-4 text-black">Create Poll</Link>
        <Link to="/profile" className="ml-4 text-black">Profile</Link>


        <button onClick={handleLogout} className="ml-4  border border-black rounded px-3 py-1 bg-white hover:text-gray-800 text-black">Logout</button>
      </div>
    </nav>
  );
};

export default checkUser(Navbar);
