import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Stats from './components/Stats';
import Features from './components/Features';
import Footer from './components/Footer';
import MeetMyTeam from './components/MeetMyTeam';
import FAQS from './components/FAQs';
import SearchPage from './pages/SearchPage'; 
import VideoPage from './pages/VideoPage'; 
import HistoryPage from './pages/HistoryPage';
const App = () => {
    const teamSectionRef = useRef(null);
    const videoSectionRef = useRef(null);
    const featuresSectionRef = useRef(null);

    const scrollToTeam = () => {
        teamSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToVideo = () => {
        videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToFeatures = () => {
        featuresSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Function to handle saving video history
    const handleSaveHistory = async (videoId, title) => {
        const userId = 'random-user-id'; // Replace with dynamic user ID (e.g., from session or localStorage)

        try {
            await fetch('http://localhost:5000/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, videoId, title }),
            });
        } catch (err) {
            console.error('Error saving history:', err);
        }
    };

    return (
        <Router>
            <Routes>
                {/* Main page */}
                <Route
                    path="/"
                    element={
                        <div>
                            <Header scrollToTeam={scrollToTeam} />
                            <MainContent
                                scrollToVideo={scrollToVideo}
                                scrollToFeatures={scrollToFeatures}
                            />
                            <div ref={videoSectionRef}>
                                <Stats />
                            </div>
                            <div ref={featuresSectionRef}>
                                <Features />
                            </div>
                            <div ref={teamSectionRef}>
                                <MeetMyTeam />
                            </div>
                            <FAQS />
                            <Footer />
                        </div>
                    }
                />
                {/* Search page */}
                <Route
                    path="/search"
                    element={<SearchPage handleSaveHistory={handleSaveHistory} />}
                />
                {/* Video page */}
                <Route
                    path="/video/:id"
                    element={<VideoPage handleSaveHistory={handleSaveHistory} />}
                />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
        </Router>
    );
};

export default App;
