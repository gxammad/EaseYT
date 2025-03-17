import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileDownload, FaArrowLeft, FaBrain } from "react-icons/fa";
import jsPDF from "jspdf";
import "./SummaryPage.css"; // Create a CSS file for styling

const SummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Get transcription from previous page
    const transcription = location.state?.transcription || "";

    // Function to generate summary
    const generateSummary = async () => {
        if (!transcription.trim()) {
            alert("No transcription text available!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("YOUR_OPENAI_API_ENDPOINT", {
                prompt: `Summarize this text:\n\n${transcription}`,
                max_tokens: 150,
                temperature: 0.7,
            });
            setSummary(response.data.summary || "No summary generated.");
        } catch (error) {
            console.error("Error generating summary:", error);
            alert("Failed to generate summary.");
        }
        setLoading(false);
    };

    // Function to download summary as PDF
    const downloadPDF = () => {
        if (!summary.trim()) {
            alert("No summary to download!");
            return;
        }

        const doc = new jsPDF();
        doc.text("Video Summary", 10, 10);
        doc.text(summary, 10, 20);
        doc.save("summary.pdf");
    };

    return (
        <div className="summary-page">
            <header className="header-sum">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <h2>Generate Summary</h2>
            </header>

            <div className="content">
                <div className="summary-box">
                    <h3><FaBrain /> Summary</h3>
                    <p>{summary || "Your summary will appear here..."}</p>
                </div>

                <div className="buttons">
                    <button className="generate-btn" onClick={generateSummary} disabled={loading}>
                        {loading ? "Generating..." : "Generate Summary"}
                    </button>
                    <button className="download-btn" onClick={downloadPDF}>
                        <FaFileDownload /> Download PDF
                    </button>

                </div>
                
            </div>
        </div>
    );
};

export default SummaryPage;
