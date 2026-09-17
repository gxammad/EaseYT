import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaHistory, FaPlay, FaSearch, FaYoutube } from 'react-icons/fa';
import GlobalNavbar from '../components/GlobalNavbar';
import Footer from '../components/Footer';
import './HistoryPage.css';

const defaultDemoHistory = [
  { id: "6umk3wMl6OY", title: "How Large Language Models Work - In-Depth Visual Walkthrough" },
  { id: "EPwOPr2xkYo", title: "Wahab Riaz Spell Stuns Hosts - ICC Cricket World Cup Thriller" },
  { id: "bEB8-SWMYhI", title: "32 Minutes of English Listening Comprehension for All Levels" }
];

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
      const uniqueHistory = storedHistory.reduce((acc, video) => {
        if (video && video.id && !acc.find(item => item.id === video.id)) {
          acc.push(video);
        }
        return acc;
      }, []);

      if (uniqueHistory.length === 0) {
        // Initialize with default sample history for rich UI demo on Vercel
        setHistory(defaultDemoHistory);
        localStorage.setItem('videoHistory', JSON.stringify(defaultDemoHistory));
      } else {
        setHistory(uniqueHistory);
      }
    } catch (e) {
      setHistory(defaultDemoHistory);
    }
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleDelete = (videoId, e) => {
    e.stopPropagation();
    const updatedHistory = history.filter(video => video.id !== videoId);
    setHistory(updatedHistory);
    try {
      localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.warn("Could not persist deleted history:", err);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Clear your entire watch & transcription history?")) {
      setHistory([]);
      try {
        localStorage.removeItem('videoHistory');
      } catch (err) {
        console.warn("Could not clear history:", err);
      }
    }
  };

  return (
    <div className="history-page-wrapper">
      <GlobalNavbar />

      <main className="history-page-main">
        {/* Header */}
        <section className="history-header-section">
          <div className="history-badge">
            <FaHistory className="badge-icon" />
            <span>Activity Log</span>
          </div>
          <div className="history-title-row">
            <div>
              <h1 className="history-title">Watch & Transcription History</h1>
              <p className="history-desc">
                Quickly resume your transcribed videos, generated notes, and subtitle translations.
              </p>
            </div>
            {history.length > 0 && (
              <button className="clear-all-btn" onClick={handleClearAll}>
                <FaTrash /> Clear All History
              </button>
            )}
          </div>
        </section>

        {/* List Content */}
        <section className="history-list-section">
          {history.length > 0 ? (
            <div className="history-grid">
              {history.map((video, index) => (
                <div
                  key={video.id || index}
                  className="history-card-item"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="history-thumb-wrap">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="history-thumb"
                    />
                    <div className="history-play-hover">
                      <FaPlay />
                    </div>
                  </div>

                  <div className="history-meta">
                    <span className="history-index">#{index + 1}</span>
                    <h3 className="history-video-title" title={video.title}>
                      {video.title}
                    </h3>
                    <div className="history-tags">
                      <span className="history-tag"><FaYoutube /> YouTube</span>
                      <span className="history-tag">Saved to Session</span>
                    </div>
                  </div>

                  <button
                    className="delete-item-btn"
                    onClick={(e) => handleDelete(video.id, e)}
                    title="Remove from history"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-empty-card">
              <div className="empty-icon-circle">
                <FaHistory />
              </div>
              <h3>No Watch History Yet</h3>
              <p>Search or paste any YouTube video URL to begin transcribing and generating summaries.</p>
              <Link to="/search" className="browse-videos-btn">
                <FaSearch /> Explore & Transcribe Videos
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
