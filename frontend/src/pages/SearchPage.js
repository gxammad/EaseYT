import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { Link } from 'react-router-dom'; 
import logo from "./easeyt.png"; // Import logo
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const SearchPage = ({ handleSaveHistory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const YOUTUBE_API_KEY = "AIzaSyC4NyIttqQCSoUw5CM9JGQoKGKjoLDTPAY";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }

    const videoId = extractYouTubeVideoId(searchQuery);
    if (videoId) {
      fetchExactVideo(videoId);
    } else {
      fetchSearchResults(searchQuery);
    }
  };

  // **Function to extract YouTube Video ID**
  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // **Fetch video by exact video ID**
  const fetchExactVideo = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        alert("No video found for this URL.");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  // **Fetch search results**
  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // **Handle video selection**
  const handleVideoClick = (videoId, title) => {
    if (!videoId) {
      alert("Invalid video ID");
      return;
    }
    handleSaveHistory(videoId, title);
    navigate(`/video/${videoId}`);
  };

  return (
    <div>
      <header className="search-header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Ease YT Logo" />
        </div>
        <nav>
          <ul className="nav-list">
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/video">Videos</Link></li>
              <li><Link to="/translate">Translation</Link></li>
              <li><Link to="/summary">Summary</Link></li>
              <li><Link to="/history">History</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main-search-content">
        <img src={logo} alt="Ease YT Logo" />
        <h2>Search YouTube Videos</h2>
        <div className="search-se-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
            placeholder="Enter a video title or URL..."
          />
          <button onClick={handleSearchSubmit}>Search</button>
        </div>
      </main>

      <div className="results">
        {searchResults.length > 0 ? (
          searchResults.map((video) => (
            <div
              key={video.id.videoId || video.id}
              className="result-card"
              onClick={() =>
                handleVideoClick(video.id.videoId || video.id, video.snippet.title)
              }
            >
              <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
              <div className="title">{video.snippet.title}</div>
              <div className="description">
                {video.snippet.description.substring(0, 100)}...
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results found. Try a different search.</p>
        )}
      </div>

      <footer className="footer">
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
        </div>
        <div className="footer-text">
          <p>© 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
