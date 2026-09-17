import React from 'react';
import './Stats.css';
import { FaUsers, FaDatabase, FaVideo, FaGlobe, FaPlayCircle } from 'react-icons/fa';

const Stats = () => (
  <section className="stats-section">
    <div className="stats-container">
      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap"><FaUsers /></div>
          <h2 className="metric-number">100K+</h2>
          <p className="metric-label">Active Users</p>
          <span className="metric-sub">Global Community</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap"><FaDatabase /></div>
          <h2 className="metric-number">500GB+</h2>
          <p className="metric-label">Audio Processed</p>
          <span className="metric-sub">High Speed AI Pipeline</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap"><FaVideo /></div>
          <h2 className="metric-number">1M+</h2>
          <p className="metric-label">Videos Transcribed</p>
          <span className="metric-sub">Lectures & Podcasts</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap"><FaGlobe /></div>
          <h2 className="metric-number">80+</h2>
          <p className="metric-label">Languages Supported</p>
          <span className="metric-sub">Neural Machine Translation</span>
        </div>
      </div>

      {/* Video Showcase Section */}
      <div className="video-showcase">
        <div className="showcase-header">
          <span className="showcase-badge"><FaPlayCircle /> Instant Demo</span>
          <h2 className="showcase-title">No Sign-Up Or Credit Card Required</h2>
          <p className="showcase-desc">
            Experience lightning-fast YouTube transcription and automated summaries right in your browser.
          </p>
        </div>

        <div className="video-player-frame">
          <div className="frame-ambient-glow"></div>
          <div className="video-frame-inner">
            <iframe
              width="100%"
              height="480"
              src="https://www.youtube.com/embed/6umk3wMl6OY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Stats;
