import React from 'react';
import { Link } from 'react-router-dom';
import './MainContent.css';
import videoIcon from './video.png';
import { FaPlay, FaCompass, FaMagic, FaLanguage, FaFilePdf, FaCheckCircle } from 'react-icons/fa';

const MainContent = ({ scrollToVideo, scrollToFeatures }) => (
  <main className="hero-section">
    <div className="hero-container">
      {/* Left Column: Text & CTAs */}
      <div className="hero-content">
        <div className="hero-badge">
          <FaMagic className="badge-icon" />
          <span>AI-Powered Video Intelligence</span>
        </div>

        <h1 className="hero-heading">
          Transcribe, Summarize & <br />
          <span className="gradient-text">Understand YouTube</span> Faster
        </h1>

        <p className="hero-subtext">
          Convert any YouTube video into crystal-clear subtitles, multilingual translations,
          concise AI executive summaries, and downloadable formatted PDF notes.
        </p>

        {/* Feature Highlights Pills */}
        <div className="hero-pills">
          <span className="hero-pill"><FaCheckCircle /> Accurate AI Captions</span>
          <span className="hero-pill"><FaLanguage /> 80+ Languages</span>
          <span className="hero-pill"><FaFilePdf /> 1-Click PDF Export</span>
        </div>

        <div className="hero-buttons">
          <Link to="/search" className="hero-btn primary-btn">
            <FaPlay className="btn-icon" /> Try Search & Transcribe
          </Link>
          <button className="hero-btn secondary-btn" onClick={scrollToVideo}>
            <FaPlay className="btn-icon" /> Watch Demo
          </button>
          <button className="hero-btn ghost-btn" onClick={scrollToFeatures}>
            <FaCompass className="btn-icon" /> Features
          </button>
        </div>
      </div>

      {/* Right Column: Interactive Visual Card */}
      <div className="hero-visual">
        <div className="visual-card-wrapper">
          <div className="ambient-glow"></div>
          <div className="visual-card">
            <div className="card-header-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="card-mock-title">EaseYT Player & Transcriber</span>
            </div>
            <div className="visual-inner">
              <img src={videoIcon} alt="EaseYT Video Showcase" className="hero-video-icon" />
              <div className="floating-badge badge-top">
                <span className="pulse-indicator"></span>
                <span>Live AI Transcription</span>
              </div>
              <div className="floating-badge badge-bottom">
                <FaFilePdf className="pdf-icon" />
                <span>Executive Summary Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default MainContent;
