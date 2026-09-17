import React from 'react';
import './MeetMyTeam.css';
import ahmerImg from './ahmer.png';
import nabihaImg from './nabiha.png';
import ammadImg from './ammad.png';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const teamMembers = [
  {
    name: "Ahmer Naseer",
    role: "Senior Project Manager",
    image: ahmerImg,
    bio: "Guiding product architecture, milestones, and user experience strategy."
  },
  {
    name: "Nabiha Hanook",
    role: "Documentation & QA",
    image: nabihaImg,
    bio: "Ensuring top-quality technical documentation, API testing, and specifications."
  },
  {
    name: "Ammad Waqas",
    role: "Lead Full-Stack Developer",
    image: ammadImg,
    bio: "Architecting the AI ingestion engine, React frontend, and cloud integrations."
  }
];

const MeetMyTeam = () => (
  <section className="team-section">
    <div className="team-container">
      <div className="team-header">
        <span className="team-badge">The Innovators</span>
        <h2 className="team-title">Meet Our Team</h2>
        <p className="team-subtitle">
          The passionate minds building the future of AI-powered video transcription and intelligence.
        </p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="team-card">
            <div className="avatar-wrapper">
              <div className="avatar-ring"></div>
              <img src={member.image} alt={member.name} className="team-avatar" />
            </div>
            <h3 className="member-name">{member.name}</h3>
            <span className="member-role">{member.role}</span>
            <p className="member-bio">{member.bio}</p>
            <div className="member-socials">
              <span className="social-icon"><FaLinkedin /></span>
              <span className="social-icon"><FaGithub /></span>
              <span className="social-icon"><FaEnvelope /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MeetMyTeam;
