import React from 'react';
import './MainContent.css';
import videoIcon from './video.png';

const MainContent = ({ scrollToVideo, scrollToFeatures }) => (
    <main className="main-content">
        <div className="text-content">
            <h1>Watch videos with </h1>
            <h1>translated subtitles,</h1>
            <p>Browse and watch videos with translated subtitles for better understanding.</p>
            <div className="buttons">
                <button className="play-btn" onClick={scrollToVideo}>PLAY NOW</button>
                <button className="explore-btn" onClick={scrollToFeatures}>Explore features</button>
            </div>
        </div>
        <div className="icon">
            <img src={videoIcon} alt="Video Icon" className="video-icon" />
        </div>
    </main>
);

export default MainContent;
