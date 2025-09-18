import React from 'react';
import './Navbar.css';
import logo from '../assets/react.svg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); 
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span>Visions Global Empowerment</span>
      </div>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a onClick={()=>navigate('/donate')}>Donate</a>
        <a href="#campaign">Campaign</a>
        {/* If "Campaign" is a route, use: <Link to="/campaign">Campaign</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
