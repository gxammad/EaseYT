import React from 'react';
import './Features.css';

const Features = () => (

    <section className="features">
        <div className="feature-card">
            <div className="icon collaboration-icon"></div> {/* Add icon manually */}
            <h3>Collaboration</h3>
            <p>No installations or setup. Just add URL of YouTube video and hit the search button.</p>
        </div>
        <div className="feature-card">
            <div className="icon live-transcription-icon"></div> {/* Add icon manually */}
            <h3>Live Transcription</h3>
            <p>Our AI note taker transcribes your video to 100% accurate speaker identification and translation.</p>
        </div>
        <div className="feature-card">
            <div className="icon ai-summary-icon"></div> {/* Add icon manually */}
            <h3>AI Summary</h3>
            <p>Use one-click AI prompts to generate a summary, action items, or next YouTube video for your Ease.</p>
        </div>
    </section>
);

export default Features;
