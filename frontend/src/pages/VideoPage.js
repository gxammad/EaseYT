import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css';
import GlobalNavbar from '../components/GlobalNavbar';
import Footer from '../components/Footer';
import { jsPDF } from "jspdf";
import { FiInfo } from 'react-icons/fi';
import { FaLanguage, FaMusic, FaFilePdf, FaBrain, FaCopy, FaCheck, FaPlay, FaMagic } from 'react-icons/fa';

const sampleTranscriptions = {
  default: "Welcome everyone to this comprehensive overview of AI systems and modern video intelligence pipelines. In today's session, we are analyzing how large multimodal models process continuous audio streams, extract contextual phonetic tokens, and synthesize natural language subtitles in real-time. By leveraging speaker diarization, transformers, and neural translation, systems like EaseYT allow users from across the globe to overcome language boundaries, generate automated executive summaries, and produce printable study documents within seconds."
};

const VideoPage = ({ handleSaveHistory }) => {
  const { id } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [filteredTranscription, setFilteredTranscription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isFullAudio, setIsFullAudio] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showInstruction, setShowInstruction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const YOUTUBE_API_KEY = 'AIzaSyCboPqNrU0li8JKGv6lw4epHXEQV_9bLWQ';

  // Fetch Video Details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: { part: 'snippet,contentDetails,statistics', id, key: YOUTUBE_API_KEY }
        });

        if (response.data.items && response.data.items.length > 0) {
          setVideoDetails(response.data.items[0]);
        } else {
          // Fallback video title
          setVideoDetails({
            id,
            snippet: {
              title: `YouTube Video (${id})`,
              description: "Video player loaded in EaseYT.",
              channelTitle: "YouTube Creator"
            }
          });
        }
      } catch (error) {
        console.warn('Using fallback video details:', error);
        setVideoDetails({
          id,
          snippet: {
            title: `YouTube Video (${id})`,
            description: "Video player loaded in EaseYT.",
            channelTitle: "YouTube Creator"
          }
        });
      }
    };

    fetchVideoDetails();
  }, [id]);

  // Fetch Subtitles from Backend or fallback to sample
  useEffect(() => {
    let isMounted = true;
    const fetchSubtitles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/subtitles/${id}`, { timeout: 3000 });
        if (isMounted) {
          if (response.data?.success && response.data?.subtitles) {
            const fullText = response.data.subtitles.map(sub => sub.text).join(' ');
            setFilteredTranscription(fullText);
          } else {
            // Default sample so preview on Vercel is interactive
            setFilteredTranscription(sampleTranscriptions.default);
          }
        }
      } catch (error) {
        if (isMounted) {
          // Graceful fallback for Vercel demo
          setFilteredTranscription(sampleTranscriptions.default);
        }
      }
    };

    fetchSubtitles();
    return () => { isMounted = false; };
  }, [id]);

  // Save to history
  useEffect(() => {
    if (videoDetails) {
      if (handleSaveHistory) {
        handleSaveHistory(videoDetails.id, videoDetails.snippet.title);
      }
      try {
        const storedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
        const newHistory = [
          { id: videoDetails.id, title: videoDetails.snippet.title },
          ...storedHistory.filter(item => item.id !== videoDetails.id)
        ].slice(0, 15);
        localStorage.setItem('videoHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    }
  }, [videoDetails, handleSaveHistory]);

  const timeToSeconds = (time) => {
    const [min, sec] = time.split(":").map(Number);
    return min * 60 + sec;
  };

  const isValidTime = (time) => /^\d{1,2}:\d{2}$/.test(time);

  const handleTranscribe = async () => {
    if (!id) {
      alert("No video ID found!");
      return;
    }

    if (!isFullAudio && (!startTime || !endTime)) {
      alert("Please enter both start and end times!");
      return;
    }

    if (!isFullAudio && (!isValidTime(startTime) || !isValidTime(endTime))) {
      alert("Time must be in MM:SS format!");
      return;
    }

    const startSec = isFullAudio ? 0 : timeToSeconds(startTime);
    const endSec = isFullAudio ? 0 : timeToSeconds(endTime);

    if (!isFullAudio && startSec >= endSec) {
      alert("Start time must be less than end time!");
      return;
    }

    setLoading(true);
    setFilteredTranscription("⏳ Transcribing audio stream... Please wait.");

    try {
      const response = await axios.post("http://localhost:5000/api/transcribe/google", {
        videoId: id,
        startTime: startSec,
        endTime: endSec,
        languageCode: language,
      }, { timeout: 8000 });

      setFilteredTranscription(response.data.transcript || sampleTranscriptions.default);
    } catch (error) {
      console.warn("Backend transcription unavailable, using sample:", error);
      setFilteredTranscription(sampleTranscriptions.default);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoClick = () => {
    setShowInstruction(!showInstruction);
  };

  const copyToClipboard = () => {
    if (!filteredTranscription) return;
    navigator.clipboard.writeText(filteredTranscription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Robust PDF generator with fallback
  const downloadPDF = useCallback(() => {
    if (!filteredTranscription || filteredTranscription.trim() === "" || filteredTranscription.includes("⏳")) {
      alert("No transcription text available to download!");
      return;
    }

    const videoTitle = videoDetails?.snippet?.title || "EaseYT_Transcription";
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 14;
    const marginRight = 14;
    const textWidth = pageWidth - marginLeft - marginRight;
    const lineHeight = 7;

    const renderTextContent = (startY) => {
      let yPosition = startY;

      // Header Banner
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(20, 20, 20);
      const titleLines = doc.splitTextToSize(videoTitle, textWidth);
      doc.text(titleLines, marginLeft, yPosition);
      yPosition += titleLines.length * 8 + 4;

      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(255, 0, 51);
      doc.text("AI Video Transcription (Generated with EaseYT)", marginLeft, yPosition);
      yPosition += 6;

      // Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(220, 220, 220);
      doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
      yPosition += 10;

      // Body Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);

      const lines = doc.splitTextToSize(filteredTranscription, textWidth);
      lines.forEach((line) => {
        if (yPosition + lineHeight > pageHeight - 15) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });

      doc.save(`${videoTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_Transcription.pdf`);
    };

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "/easeyt.png";

    img.onload = () => {
      try {
        doc.addImage(img, "PNG", pageWidth - marginRight - 22, 10, 22, 22);
      } catch (e) {
        console.warn("Logo addImage fallback:", e);
      }
      renderTextContent(24);
    };

    img.onerror = () => {
      renderTextContent(20);
    };
  }, [filteredTranscription, videoDetails]);

  // Typewriter effect
  useEffect(() => {
    if (filteredTranscription) {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        setTypedText(filteredTranscription.slice(0, i));
        i += 3;
        if (i > filteredTranscription.length) {
          setTypedText(filteredTranscription);
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [filteredTranscription]);

  const handleTranslateClick = () => {
    const title = videoDetails?.snippet?.title || "YouTube Video";
    navigate(`/translate?text=${encodeURIComponent(filteredTranscription)}&title=${encodeURIComponent(title)}`);
  };

  const handleSummaryClick = () => {
    const title = videoDetails?.snippet?.title || "YouTube Video";
    navigate(`/summary`, {
      state: {
        transcription: filteredTranscription,
        videoTitle: title
      }
    });
  };

  return (
    <div className="video-page-wrapper">
      <GlobalNavbar />

      <main className="video-page-main">
        {videoDetails ? (
          <div className="video-page-container">
            {/* Video Header / Title */}
            <div className="video-top-bar">
              <span className="player-badge"><FaPlay /> Playing</span>
              <h1 className="active-video-heading">{videoDetails.snippet.title}</h1>
            </div>

            {/* Video Cinema Player */}
            <div className="cinema-player-card">
              <div className="cinema-glow"></div>
              <div className="cinema-inner">
                <iframe
                  width="100%"
                  height="520"
                  src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
                  frameBorder="0"
                  allowFullScreen
                  title={videoDetails.snippet.title}
                  className="yt-iframe"
                />
              </div>
            </div>

            {/* Control Dashboard */}
            <div className="transcription-dashboard">
              <div className="dashboard-header">
                <h3><FaMagic className="dash-icon" /> AI Transcription Controls</h3>
                <span className="dash-sub">Configure speech model & timestamps</span>
              </div>

              <div className="controls-grid">
                {/* Full Audio Toggle */}
                <label className="custom-control-pill">
                  <input
                    type="checkbox"
                    checked={isFullAudio}
                    onChange={(e) => setIsFullAudio(e.target.checked)}
                  />
                  <FaMusic className="pill-icon" />
                  <span>Transcribe Full Audio</span>
                </label>

                {/* Language Selector */}
                <div className="lang-control-wrap">
                  <label className="lang-select-label">
                    <FaLanguage className="pill-icon" />
                    <span>Language:</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="lang-dropdown"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="ur">Urdu</option>
                    <option value="ja">Japanese</option>
                    <option value="ru">Russian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                  <button type="button" className="info-btn" onClick={handleInfoClick}>
                    <FiInfo />
                  </button>
                  {showInstruction && (
                    <div className="instruction-tooltip">
                      Select the primary spoken language of the video.
                    </div>
                  )}
                </div>

                {/* Transcribe Trigger Button */}
                <button
                  className="trigger-transcribe-btn"
                  onClick={handleTranscribe}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Run AI Transcription"}
                </button>
              </div>

              {/* Timestamp Range (if not full audio) */}
              {!isFullAudio && (
                <div className="timestamp-selector-row">
                  <div className="time-input-group">
                    <label>Start Time (MM:SS):</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="00:30"
                      className="time-input"
                    />
                  </div>
                  <div className="time-input-group">
                    <label>End Time (MM:SS):</label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="02:15"
                      className="time-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Transcription Box */}
            <div className="transcription-viewer-panel">
              <div className="viewer-top-bar">
                <div className="viewer-title">
                  <span className="live-dot"></span>
                  <h4>Speech-to-Text Transcription</h4>
                </div>
                <div className="viewer-actions">
                  <button className="viewer-action-btn" onClick={copyToClipboard}>
                    {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy Text</>}
                  </button>
                </div>
              </div>

              <div className="transcription-text-area">
                <p className="typed-paragraph">{typedText || "Subtitles are loading..."}</p>
              </div>

              {/* Action Buttons Row */}
              <div className="action-buttons-deck">
                <button className="deck-btn primary-deck-btn" onClick={handleSummaryClick}>
                  <FaBrain /> Generate AI Summary
                </button>
                <button className="deck-btn secondary-deck-btn" onClick={handleTranslateClick}>
                  <FaLanguage /> Translate Subtitles
                </button>
                <button className="deck-btn outline-deck-btn" onClick={downloadPDF}>
                  <FaFilePdf /> Download Formatted PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="video-loading-screen">
            <div className="spinner"></div>
            <p>Loading YouTube player and media metadata...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VideoPage;
