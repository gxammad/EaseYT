import React from 'react';
import './MeetMyTeam.css';

// Import images
import ahmerImg from './ahmer.png';
import nabihaImg from './nabiha.png';
import ammadImg from './ammad.png';

const MeetMyTeam = () => (
  <section className="team-section">
    <h2>Meet My Team</h2>
    <div className="team-members">
      <div className="team-member">
        <div className="team-image-container">
          <img src={ahmerImg} alt="Ahmer Naseer" className="team-image" />
          <div className="hover-info">
            <p className="name">Ahmer Naseer</p>
            <p className="role">Senior Project Manager</p>
          </div>
        </div>
      </div>
      <div className="team-member">
        <div className="team-image-container">
          <img src={nabihaImg} alt="Nabiha Hanook" className="team-image" />
          <div className="hover-info">
            <p className="name">Nabiha Hanook</p>
            <p className="role">Documentation</p>
          </div>
        </div>
      </div>
      <div className="team-member">
        <div className="team-image-container">
          <img src={ammadImg} alt="Ammad Waqas" className="team-image" />
          <div className="hover-info">
            <p className="name">Ammad Waqas</p>
            <p className="role">Developer</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MeetMyTeam;
