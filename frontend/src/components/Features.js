import React from 'react';
import './Features.css';
import { FaSearch, FaMicrophoneAlt, FaFilePdf, FaGlobeAmericas, FaBrain, FaBolt } from 'react-icons/fa';

const featuresData = [
  {
    icon: <FaSearch />,
    tag: "Search & Fetch",
    title: "Instant Video Discovery",
    desc: "Search YouTube videos directly inside EaseYT or paste any YouTube URL/ID to load subtitles and metadata immediately without manual downloads."
  },
  {
    icon: <FaMicrophoneAlt />,
    tag: "Speech-to-Text",
    title: "High-Accuracy Subtitles",
    desc: "Extract spoken dialogue with precise timestamps. Clip exact segments or transcribe the full audio with speaker clarity."
  },
  {
    icon: <FaGlobeAmericas />,
    tag: "Translation",
    title: "80+ Global Languages",
    desc: "Translate YouTube dialogue into Spanish, French, German, Urdu, Japanese, Arabic, and dozens more with neural accuracy."
  },
  {
    icon: <FaBrain />,
    tag: "AI Intelligence",
    title: "Concise Executive Summaries",
    desc: "Transform hour-long lectures, podcasts, and webinars into clean bullet points, key takeaways, and action items."
  },
  {
    icon: <FaFilePdf />,
    tag: "Export",
    title: "Branded PDF Note Generator",
    desc: "Export styled study sheets and executive briefings in PDF format complete with video titles, timestamps, and branding."
  },
  {
    icon: <FaBolt />,
    tag: "Zero Setup",
    title: "Instant Browser Access",
    desc: "100% web-based. No heavy software installations, browser extensions, or credit cards required to start exploring."
  }
];

const Features = () => (
  <section className="features-section">
    <div className="features-container">
      <div className="features-header">
        <span className="features-badge">Supercharged Workflow</span>
        <h2 className="features-title">Everything You Need To Master Video Content</h2>
        <p className="features-subtitle">
          Save hours of manual note-taking and language barriers with our all-in-one AI video intelligence toolkit.
        </p>
      </div>

      <div className="features-grid">
        {featuresData.map((item, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon-wrapper">
              {item.icon}
            </div>
            <span className="feature-tag">{item.tag}</span>
            <h3 className="feature-heading">{item.title}</h3>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
