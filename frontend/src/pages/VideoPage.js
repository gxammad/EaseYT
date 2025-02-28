import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css'; 
import logo from './logo.png';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const VideoPage = ({ handleSaveHistory }) => {
    const { id } = useParams();
    const [videoDetails, setVideoDetails] = useState(null);
    const [transcription, setTranscription] = useState('Loading subtitles...');
    const [filteredTranscription, setFilteredTranscription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [typedText, setTypedText] = useState('');
    const [sliderValue, setSliderValue] = useState(0);

    const YOUTUBE_API_KEY = 'AIzaSyC4NyIttqQCSoUw5CM9JGQoKGKjoLDTPAY';

    useEffect(() => {
        const fetchVideoDetails = async () => {
            if (!id) {
                console.error('No video ID found.');
                return;
            }
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos`, {
                        params: { part: 'snippet,contentDetails,statistics', id, key: YOUTUBE_API_KEY }
                    }
                );

                if (response.data.items && response.data.items.length > 0) {
                    setVideoDetails(response.data.items[0]);
                } else {
                    console.error('No video found');
                }
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [id]);

    useEffect(() => {
        const fetchSubtitles = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/subtitles/${id}`);
                if (response.data.success) {
                    const fullText = response.data.subtitles.map(sub => sub.text).join(' ');
                    setTranscription(fullText);
                    setFilteredTranscription(fullText);
                } else {
                    setTranscription('Subtitles not available.');
                }
            } catch (error) {
                console.error('Error fetching subtitles:', error);
                setTranscription('Could not load subtitles.');
            }
        };

        fetchSubtitles();
    }, [id]);

    useEffect(() => {
        if (videoDetails) {
            handleSaveHistory(videoDetails.id, videoDetails.snippet.title);
    
            const storedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
            const newHistory = [{ id: videoDetails.id, title: videoDetails.snippet.title }, ...storedHistory.slice(0, 9)];
            localStorage.setItem('videoHistory', JSON.stringify(newHistory));
        }
    }, [videoDetails, handleSaveHistory]);

    // Convert MM:SS format to seconds
    const timeToSeconds = (time) => {
        const parts = time.split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    };

    // Filter Transcription
    const handleFilterTranscription = () => {
        const startSec = timeToSeconds(startTime);
        const endSec = timeToSeconds(endTime);

        if (!startTime || !endTime || startSec >= endSec) {
            alert('Please enter a valid time range!');
            return;
        }

        const filteredText = transcription.split('\n')
            .filter(line => {
                const match = line.match(/\[(\d+):(\d+)\]/);
                if (match) {
                    const lineSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
                    return lineSeconds >= startSec && lineSeconds <= endSec;
                }
                return false;
            })
            .join('\n');

        setFilteredTranscription(filteredText || 'No transcription available in this range.');
    };

    // Typewriter Effect
    useEffect(() => {
        if (filteredTranscription) {
            let i = 0;
            const interval = setInterval(() => {
                setTypedText(filteredTranscription.slice(0, i));
                i++;
                if (i > filteredTranscription.length) {
                    clearInterval(interval);
                }
            }, 10); // Adjust typing speed
        }
    }, [filteredTranscription]);

    return (
        <div className="video-page">
            <header className="video-header">
                <div className="logo" onClick={() => window.location.href = '/'}>
                    <img src={logo} alt="Ease YT Logo" />
                </div>
                <h1 className="video-title">Video</h1>
            </header>

            <main className="video-main">
                {videoDetails ? (
                    <div className="video-container">
                        <h2>{videoDetails.snippet.title}</h2>
                        <div className="video-box">
                            <iframe
                                width="100%"
                                height="500"
                                src={`https://www.youtube.com/embed/${id}`}
                                frameBorder="0"
                                allowFullScreen
                                title={videoDetails.snippet.title}
                            />
                        </div>

                        {/* Time Selector */}
                        <div className="transcription-controls">
                            <label>Start Time (MM:SS):</label>
                            <input
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="e.g., 00:30"
                            />

                            <label>End Time (MM:SS):</label>
                            <input
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="e.g., 02:00"
                            />

                            <button className="filter-btn" onClick={handleFilterTranscription}>
                                Apply Transcription
                            </button>
                        </div>

                        {/* Slider for Transcript Time */}
                        <div className="transcription-slider">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={sliderValue} 
                                onChange={(e) => setSliderValue(e.target.value)} 
                            />
                        </div>

                        {/* Transcription Display */}
                        <div className="transcription">
                            <h3>Transcription</h3>
                            <p className="typewriter-text">{typedText}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading video...</p>
                )}
            </main>

            <footer className="footer">
                <div className="social-icons">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <FaYoutube />
                    </a>
                </div>
                <div className="footer-text">
                    <p>All rights reserved 2025</p>
                </div>
            </footer>
        </div>
    );
};

export default VideoPage;
