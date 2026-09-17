import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './GlobalNavbar.css';
import logo from './easeyt.png';
import { FaBars, FaTimes, FaSearch, FaHistory, FaLanguage, FaFileAlt, FaHome, FaInfoCircle } from 'react-icons/fa';

const GlobalNavbar = ({ scrollToTeam }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="global-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={handleLogoClick}>
          <img src={logo} alt="EaseYT Logo" className="navbar-logo-img" />
          <div className="brand-text-container">
            <span className="brand-title">Ease<span className="brand-accent">YT</span></span>
            <span className="brand-badge">AI</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaHome className="nav-icon" /> Home
          </NavLink>
          <NavLink to="/OverviewPage" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaInfoCircle className="nav-icon" /> Overview
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaSearch className="nav-icon" /> Search
          </NavLink>
          <NavLink to="/translate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaLanguage className="nav-icon" /> Translate
          </NavLink>
          <NavLink to="/summary" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaFileAlt className="nav-icon" /> Summary
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaHistory className="nav-icon" /> History
          </NavLink>
        </nav>

        {/* Action Button */}
        <div className="navbar-actions desktop-nav">
          {scrollToTeam ? (
            <button className="navbar-btn outline-btn" onClick={scrollToTeam}>
              About Us
            </button>
          ) : (
            <Link to="/search" className="navbar-btn glow-btn">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink to="/" end className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaHome /> Home
          </NavLink>
          <NavLink to="/OverviewPage" className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaInfoCircle /> Overview
          </NavLink>
          <NavLink to="/search" className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaSearch /> Search
          </NavLink>
          <NavLink to="/translate" className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaLanguage /> Translate
          </NavLink>
          <NavLink to="/summary" className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaFileAlt /> Summary
          </NavLink>
          <NavLink to="/history" className="mobile-nav-link" onClick={closeMobileMenu}>
            <FaHistory /> History
          </NavLink>
          <div className="mobile-nav-actions">
            <Link to="/search" className="navbar-btn glow-btn" onClick={closeMobileMenu}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalNavbar;
