import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './HistoryPage.css';
import logo from './easeyt.png';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Remove duplicates before setting history
        const storedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
        const uniqueHistory = storedHistory.reduce((acc, video) => {
            if (!acc.find(item => item.id === video.id)) {
                acc.push(video);
            }
            return acc;
        }, []);
        setHistory(uniqueHistory);
    }, []);

    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    const handleDelete = (videoId) => {
        const updatedHistory = history.filter(video => video.id !== videoId);
        setHistory(updatedHistory);
        localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
    };

    return (
        <div>
            <header className="history-header">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Ease YT Logo" />
                </div>
                <h2>Watch History</h2>
            </header>

            <main className="history-content">
                {history.length > 0 ? (
                    <ul className="history-list">
                        {history.map((video, index) => (
                            <li key={video.id} className="history-card">
                                <img
                                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                    alt={video.title}
                                    onClick={() => handleVideoClick(video.id)}
                                />
                                <div className="title" onClick={() => handleVideoClick(video.id)}>
                                    {index + 1}. {video.title}
                                </div>
                                <button className="delete-btn" onClick={() => handleDelete(video.id)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No watch history found.</p>
                )}
            </main>
        </div>
    );
};

export default HistoryPage;
