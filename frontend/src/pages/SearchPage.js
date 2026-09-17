import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import GlobalNavbar from "../components/GlobalNavbar";
import Footer from "../components/Footer";
import { FaSearch, FaPlay, FaFire, FaYoutube } from "react-icons/fa";

// Featured sample videos ready for instant preview
const sampleVideos = [
  {
    id: "6umk3wMl6OY",
    title: "How Large Language Models Work - In-Depth Visual Walkthrough",
    description: "A complete beginner-to-advanced explanation of LLMs, attention mechanisms, and modern AI pipelines.",
    thumbnail: "https://img.youtube.com/vi/6umk3wMl6OY/hqdefault.jpg",
    channel: "AI Explained",
    duration: "14:20"
  },
  {
    id: "EPwOPr2xkYo",
    title: "Wahab Riaz Spell Stuns Hosts - ICC Cricket World Cup Thriller",
    description: "One of the most fiery, hostile spells in cricket history. Relive the tension, pace, and sports commentary.",
    thumbnail: "https://img.youtube.com/vi/EPwOPr2xkYo/hqdefault.jpg",
    channel: "ICC Official",
    duration: "08:45"
  },
  {
    id: "bEB8-SWMYhI",
    title: "32 Minutes of English Listening Comprehension for All Levels",
    description: "Improve your language skills, accents, and everyday dialogues with structured speech exercises.",
    thumbnail: "https://img.youtube.com/vi/bEB8-SWMYhI/hqdefault.jpg",
    channel: "English Master",
    duration: "32:10"
  },
  {
    id: "CWdsqvg0wCw",
    title: "The Mystery of Yeti SOLVED! Deep Scientific Investigation",
    description: "DNA tests, historical sightings, and high-altitude wildlife evidence analyzed by renowned biologists.",
    thumbnail: "https://img.youtube.com/vi/CWdsqvg0wCw/hqdefault.jpg",
    channel: "Science World",
    duration: "18:05"
  }
];

const quickTopics = [
  "Artificial Intelligence",
  "React & Next.js",
  "World History",
  "TED Talks",
  "Space Exploration"
];

const SearchPage = ({ handleSaveHistory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const YOUTUBE_API_KEY = "AIzaSyC4NyIttqQCSoUw5CM9JGQoKGKjoLDTPAY";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchExactVideo = async (videoId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        // Fallback to sample item with this ID
        setSearchResults([
          {
            id: videoId,
            snippet: {
              title: `YouTube Video (${videoId})`,
              description: "Direct URL video loaded. Click to view transcription and generate summaries.",
              thumbnails: { medium: { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` } }
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      // Friendly fallback
      setSearchResults([
        {
          id: videoId,
          snippet: {
            title: `YouTube Video (${videoId})`,
            description: "Direct URL video loaded. Click to view transcription and generate summaries.",
            thumbnails: { medium: { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` } }
          }
        }
      ]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        // Filter sample videos matching query as graceful fallback
        const filtered = sampleVideos.filter(v =>
          v.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.length > 0 ? filtered.map(v => ({
          id: { videoId: v.id },
          snippet: {
            title: v.title,
            description: v.description,
            thumbnails: { medium: { url: v.thumbnail } }
          }
        })) : []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      const filtered = sampleVideos.filter(v =>
        v.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.map(v => ({
        id: { videoId: v.id },
        snippet: {
          title: v.title,
          description: v.description,
          thumbnails: { medium: { url: v.thumbnail } }
        }
      })));
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    const videoId = extractYouTubeVideoId(searchQuery);
    if (videoId) {
      fetchExactVideo(videoId);
    } else {
      fetchSearchResults(searchQuery);
    }
  };

  const handleQuickSearch = (topic) => {
    setSearchQuery(topic);
    fetchSearchResults(topic);
  };

  const handleVideoClick = (videoId, title) => {
    if (!videoId) return;
    if (handleSaveHistory) {
      handleSaveHistory(videoId, title);
    }
    // Also save to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("videoHistory")) || [];
      const updated = [{ id: videoId, title }, ...stored.filter(v => v.id !== videoId)].slice(0, 15);
      localStorage.setItem("videoHistory", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save history:", e);
    }

    navigate(`/video/${videoId}`);
  };

  return (
    <div className="search-page-wrapper">
      <GlobalNavbar />

      <main className="search-page-main">
        {/* Search Hero */}
        <section className="search-hero">
          <div className="search-hero-badge">
            <FaYoutube className="yt-badge-icon" />
            <span>AI Transcription Engine</span>
          </div>
          <h1 className="search-hero-title">
            Search Any <span className="gradient-text">YouTube Video</span>
          </h1>
          <p className="search-hero-desc">
            Paste a full YouTube URL or search keywords to inspect subtitles, translations, and PDF notes.
          </p>

          {/* Search Box */}
          <form className="search-bar-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <FaSearch className="search-lens-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Paste YouTube link (e.g., https://youtu.be/...) or video title..."
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-query-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Quick topics */}
          <div className="quick-topics-row">
            <span className="topics-label"><FaFire /> Popular Topics:</span>
            {quickTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                className="quick-topic-chip"
                onClick={() => handleQuickSearch(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Results / Showcase Section */}
        <section className="search-results-section">
          <div className="section-header-row">
            <h2 className="section-heading">
              {searched ? "Search Results" : "Featured & Trending Videos"}
            </h2>
            <span className="results-count-badge">
              {searchResults.length > 0 ? `${searchResults.length} videos` : "Ready to transcribe"}
            </span>
          </div>

          {loading ? (
            <div className="search-loading-state">
              <div className="spinner"></div>
              <p>Fetching YouTube metadata and captions...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="results-grid">
              {searchResults.map((video) => {
                const vidId = video.id?.videoId || video.id;
                const title = video.snippet?.title || "YouTube Video";
                const desc = video.snippet?.description || "";
                const thumb = video.snippet?.thumbnails?.medium?.url ||
                  video.snippet?.thumbnails?.high?.url ||
                  `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`;

                return (
                  <div
                    key={vidId}
                    className="video-result-card"
                    onClick={() => handleVideoClick(vidId, title)}
                  >
                    <div className="thumbnail-container">
                      <img src={thumb} alt={title} className="card-thumbnail" />
                      <div className="play-overlay">
                        <div className="play-button-circle">
                          <FaPlay />
                        </div>
                      </div>
                      <span className="hd-badge">HD</span>
                    </div>

                    <div className="card-body">
                      <h3 className="card-video-title" title={title}>{title}</h3>
                      <p className="card-video-desc">
                        {desc ? desc.substring(0, 95) + "..." : "Click to view transcription, timestamps, and AI notes."}
                      </p>
                      <div className="card-footer-action">
                        <span className="action-pill">Transcribe & Summarize →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* If no search yet, display featured videos */
            <div className="results-grid">
              {sampleVideos.map((video) => (
                <div
                  key={video.id}
                  className="video-result-card"
                  onClick={() => handleVideoClick(video.id, video.title)}
                >
                  <div className="thumbnail-container">
                    <img src={video.thumbnail} alt={video.title} className="card-thumbnail" />
                    <div className="play-overlay">
                      <div className="play-button-circle">
                        <FaPlay />
                      </div>
                    </div>
                    <span className="duration-badge">{video.duration}</span>
                  </div>

                  <div className="card-body">
                    <span className="card-channel">{video.channel}</span>
                    <h3 className="card-video-title" title={video.title}>{video.title}</h3>
                    <p className="card-video-desc">{video.description}</p>
                    <div className="card-footer-action">
                      <span className="action-pill">Transcribe & Summarize →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
