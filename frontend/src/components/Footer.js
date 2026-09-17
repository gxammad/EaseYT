import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from './easeyt.png';
import { FaYoutube, FaTwitter, FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => (
  <footer className="global-footer">
    <div className="footer-container">
      <div className="footer-top">
        {/* Brand info */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="EaseYT Logo" />
            <span className="brand-text">Ease<span className="accent">YT</span></span>
          </div>
          <p className="footer-tagline">
            Next-generation AI video intelligence. Transcribe dialogue, translate subtitles into 80+ languages,
            and export executive summaries to PDF with one click.
          </p>
          <div className="footer-socials">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://github.com/gxammad/EaseYT" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-nav-col">
          <h4 className="col-title">Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/OverviewPage">Overview</Link></li>
            <li><Link to="/search">Video Search</Link></li>
            <li><Link to="/translate">Translation Studio</Link></li>
            <li><Link to="/summary">AI Summary</Link></li>
            <li><Link to="/history">Watch History</Link></li>
          </ul>
        </div>

        {/* Capabilities */}
        <div className="footer-nav-col">
          <h4 className="col-title">Features</h4>
          <ul>
            <li><span>AI Speech-to-Text</span></li>
            <li><span>Multilingual Audio</span></li>
            <li><span>Timestamp Clipping</span></li>
            <li><span>Formatted PDF Notes</span></li>
            <li><span>One-Click Summaries</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} EaseYT. Crafted with <FaHeart className="heart-icon" /> by Team EaseYT.
        </p>
        <p className="build-tag">Vercel Production Ready • Open Source</p>
      </div>
    </div>
  </footer>
);

export default Footer;
