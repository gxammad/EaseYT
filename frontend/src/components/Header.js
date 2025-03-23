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
                <li><Link to="/Overview">Overview</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/translate">Translation</Link></li>
                <li><Link to="/summary">Summary</Link></li>
                <li><Link to="/history">History</Link></li>
            </ul>
        </nav>
        {/* Button triggers scrollToTeam function */}
        <button className="about-btn" onClick={scrollToTeam}>ABOUT US</button>
    </header>
);

export default Header;
