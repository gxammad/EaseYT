import React from 'react';
import './Stats.css';

const Stats = () => (
    <section className="stats">
        <div className="stat-box">
            <h2>100K+</h2>
            <p>Viewers online</p>
        </div>
        <div className="stat-box">
            <h2>500GB+</h2>
            <p>Videos watched</p>
        </div>
        <div className="stat-box">
            <h2>1M+</h2>
            <p>Videos viewed</p>
        </div>
        <div className="stat-box">
            <button>Watch</button>
        </div>

        {/* Video Section below cards */}
        <div className="video-section">
            <h2>Without entering your email.</h2>
            <p>Need to transcribe and summarize your YouTube videos to text?</p>
            <div className="video-container">
                <iframe
                    width="100%"
                    height="450"
                    src="https://www.youtube.com/embed/6umk3wMl6OY"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </section>
    
);

export default Stats;
