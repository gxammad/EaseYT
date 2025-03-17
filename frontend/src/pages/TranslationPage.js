import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaLanguage, FaExchangeAlt, FaRegCopy } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaRobot } from "react-icons/fa"; // AI Icon
import logo from './logo.png';
import './TranslationPage.css'; 

const TranslationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialText = queryParams.get("text") || "No transcription available.";

    const [originalText, setOriginalText] = useState(initialText);
    const [translatedText, setTranslatedText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("fr");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTranslation = async () => {
        if (!originalText.trim()) {
            setError("Original text cannot be empty.");
            return;
        }

        setLoading(true);
        setError("");
        setTranslatedText("");

        try {
            const response = await fetch(
                `http://localhost:5000/api/translate?text=${encodeURIComponent(originalText)}&sourceLang=en&targetLang=${selectedLanguage}`
            );
            const data = await response.json();

            if (data.translatedText) {
                setTranslatedText(data.translatedText);
            } else {
                throw new Error("Translation unavailable.");
            }
        } catch (err) {
            console.error("Error translating text:", err);
            setError("Translation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="translation-page">
            {/* Header Section */}
            <header className="search-header">
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="Ease YT Logo" />
                </div>
                <nav>
                    <ul className="nav-list">
                        <li><Link to="/search">Search</Link></li>
                        <li><Link to="/video:id">Videos</Link></li>
                        <li ><Link to="/translate">Translation</Link></li>
                        <li><Link to="/summary">Summary</Link></li>
                        <li><Link to="/history">History</Link></li>
                    </ul>
                </nav>
            </header>

            {/* Translation Section */}
            <div className="translation-container">
                {/* Original Text Section */}
                <div className="translation-box">
                    <h3><FaLanguage className="language-icon" /> Original Transcription</h3>
                    <textarea
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        rows="4"
                        cols="50"
                    />
                    <button className="clear-btn" onClick={() => setOriginalText("")}>Clear Text</button>
                </div>

                {/* Language Selection & Translate Button */}
                <div className="language-selector">
                    <label><FaExchangeAlt /> Select Language</label>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="zh">Chinese (Mandarin)</option>
                    <option value="es">Spanish</option>
                    <option value="hi">Hindi</option>
                    <option value="ar">Arabic</option>
                    <option value="bn">Bengali</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="ja">Japanese</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                    <option value="ur">Urdu</option>
                    <option value="it">Italian</option>
                    <option value="tr">Turkish</option>
                    <option value="ko">Korean</option>
                    <option value="vi">Vietnamese</option>
                    <option value="pl">Polish</option>
                    <option value="uk">Ukrainian</option>
                    <option value="fa">Persian (Farsi)</option>
                    <option value="nl">Dutch</option>

                    </select>
                    <button className="translate-btn" onClick={handleTranslation} disabled={loading}>
                        {loading ? "Translating..." : "Translate"}
                    </button>
                </div>

                {/* Translated Text Section */}
                {error && <p className="error-message">{error}</p>}
                {translatedText && (
                    <div className="translation-result">
                        <h3><FaLanguage className="language-icon" /> Translated Text</h3>
                        <p>{translatedText}</p>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(translatedText)}>
                            <FaRegCopy /> Copy Text
                        </button>
                    </div>
                )}
            </div>

            {/* Summary Button Section */}
            <section className="summary-btn-container">
            <button 
            className="summary-btn" 
            onClick={() => navigate("/summary", { state: { transcription: translatedText } })}
            >
                    <FaRobot className="ai-icon" /> Generate Summary
                </button>
            </section>

            {/* Footer Section */}
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
                    <p>&copy; 2025. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TranslationPage;
