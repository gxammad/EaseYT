import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileDownload, FaArrowLeft, FaBrain } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import "./SummaryPage.css";
import logo from "./easeyt.png";

const SummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get transcription & video title from previous page
    const transcription = location.state?.transcription || "";
    const videoTitle = location.state?.videoTitle || "Untitled Video"; 

    // Set transcription as initial summary
    useEffect(() => {
        setSummary(transcription);
    }, [transcription]);


   // Function to generate summary using new API
const generateSummary = useCallback(async () => {
    if (!summary.trim()) {
        setError("Please enter some text to summarize.");
        return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
        const response = await axios.post("http://localhost:5000/api/generate-summary", {
            text: summary,
        });

        if (response.data && response.data.summary) {
            // Remove \boxed{} using regex
            const cleanSummary = response.data.summary.replace(/\\boxed\{(.*?)\}/g, "$1").trim();
            setSummary(cleanSummary);
        } else {
            setError("No summary generated. Please try again.");
        }
    } catch (err) {
        setError(err.response?.data?.error || "Error connecting to the server.");
    } finally {
        setLoading(false);
    }
}, [summary]);

    // Function to download summary as a formatted PDF
    const downloadPDF = () => {
        if (!summary || summary.trim() === "" || summary.includes("No summary")) {
            setError("No summary available to download!");
            return;
        }
    
        console.log("Generating PDF with summary:", summary); // Debugging line
    
        // Clean the summary (remove \boxed{})
        const cleanSummary = summary.replace(/\\boxed\{(.*?)\}/g, "$1");
    
        // Create PDF document
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = 10;
        const marginRight = 10;
        const textWidth = pageWidth - marginLeft - marginRight;
    
        // Load Ease YT logo
        const logo = new Image();
        logo.src = "/easeyt.png"; // Ensure this path is correct
    
        logo.onload = () => {
            // Add logo to the top left corner (x: 10, y: 10, width: 30, height: 30)
            doc.addImage(logo, "PNG", 80, -14, 45, 45);
    
            // Title Formatting
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            const titleLines = doc.splitTextToSize(videoTitle, textWidth);
            doc.text(titleLines, marginLeft, 25); // Adjusted to appear below the logo
    
            // Subtitle
            let titleHeight = 15 + titleLines.length * 10;
            doc.setFontSize(14);
            doc.text("Video Summary:", marginLeft, titleHeight + 10);
    
            // Separator line
            doc.setLineWidth(0.5);
            doc.line(marginLeft, titleHeight + 15, pageWidth - marginRight, titleHeight + 15);
    
            // Summary Text
            doc.setFont("Open Sans", "normal"); 
            doc.setFontSize(12);
            const summaryLines = doc.splitTextToSize(cleanSummary, textWidth);
            doc.text(summaryLines, marginLeft, titleHeight + 25);
    
            // Save PDF
            doc.save(`${videoTitle}_Summary.pdf`);
        };
    
        // Ensure image loads correctly
        logo.onerror = () => {
            console.error("Failed to load logo image.");
            setError("Error loading logo image.");
        };
    };
    

    return (
        <div className="summary-page">
            {/* Header Section */}
            <header className="header-sum">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <img src={logo} alt="EaseYT Logo" className="easeyt-logo" />
                <h2>Generate Summary</h2>
            </header>

            {/* Summary Content Section */}
            <div className="content">
                {/* Video Title Display */}
                <h3 className="video-title">Video Title: {videoTitle}</h3>

                <div className="summary-box">
                    <h3><FaBrain /> Summary</h3>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="15"
                        cols="80"
                        disabled={loading}
                        placeholder="Your summarized content will appear here..."
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>

                <div className="buttons">
                    <button className="generate-btn" onClick={generateSummary} disabled={loading || !summary.trim()}>
                        {loading ? "Generating..." : "Generate Summary"}
                    </button>
                    <button className="download-btn" onClick={downloadPDF} disabled={loading || !summary.trim()}>
                        <FaFileDownload /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
