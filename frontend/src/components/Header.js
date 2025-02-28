import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Header.css';
import logo from './logo.png';

const Header = ({ scrollToTeam }) => (
    <header className="header">
        <div className="logo">
            {/* Use Link for navigating back to the home page */}
            <Link to="/">
                <img src={logo} alt="Ease YT Logo" />
            </Link>
        </div>
        <nav>
            <ul>
                {/* Use Link for navigation */}
                <li><Link to="/search">Search</Link></li>
                <li><a href="#videos">Videos</a></li>
                <li><a href="#translation">Translation</a></li>
                <li><a href="#summary">Summary</a></li>
                <li><Link to="/history">History</Link></li>
            </ul>
        </nav>
        {/* Button triggers scrollToTeam function */}
        <button className="about-btn" onClick={scrollToTeam}>ABOUT US</button>
    </header>
);

export default Header;
