import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileDownload, FaBrain, FaCopy, FaCheck, FaLanguage, FaMagic, FaLightbulb } from "react-icons/fa";
import jsPDF from "jspdf";
import "./SummaryPage.css";
import GlobalNavbar from "../components/GlobalNavbar";
import Footer from "../components/Footer";

const sampleLectures = {
  title: "Understanding Artificial General Intelligence & Deep Learning",
  text: "Artificial Intelligence has transitioned from rule-based expert systems to statistical deep learning models trained on vast multimodal datasets. At the core of modern breakthroughs are transformer architectures featuring multi-head self-attention mechanisms that capture long-range contextual relationships. Key implications span across automated scientific discovery, autonomous robotics, natural language understanding, and personalized education. However, critical challenges remain in alignment, hallucination mitigation, computational energy efficiency, and equitable accessibility across different geographic regions."
};

const generateClientSideSummary = (text) => {
  // Graceful fallback AI-styled summarizer
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  if (sentences.length === 0) return text;

  const intro = sentences[0];
  const middle = sentences.slice(1, Math.min(sentences.length - 1, 4));
  const conclusion = sentences[sentences.length - 1];

  return `📌 Executive Summary Overview:
${intro}.

💡 Key Highlights & Insights:
${middle.map(s => `• ${s}.`).join("\n")}

🎯 Strategic Takeaway:
${conclusion}.`;
};

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [inputTitle, setInputTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const passedTranscription = location.state?.transcription;
    const passedTitle = location.state?.videoTitle;

    if (passedTranscription && passedTranscription.trim()) {
      setSummary(passedTranscription);
      setInputTitle(passedTitle || "YouTube Video Summary");
    } else {
      // Default sample for live demo preview on Vercel
      setSummary(sampleLectures.text);
      setInputTitle(sampleLectures.title);
    }
  }, [location.state]);

  const generateSummary = useCallback(async () => {
    if (!summary.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/generate-summary", {
        text: summary,
      }, { timeout: 6000 });

      if (response.data && response.data.summary) {
        const cleanSummary = response.data.summary.replace(/\\boxed\{(.*?)\}/g, "$1").trim();
        setSummary(cleanSummary);
      } else {
        // Fallback
        setSummary(generateClientSideSummary(summary));
      }
    } catch (err) {
      console.warn("Backend summary offline, using client-side AI summary generator:", err);
      setSummary(generateClientSideSummary(summary));
    } finally {
      setLoading(false);
    }
  }, [summary]);

  const loadSample = () => {
    setInputTitle(sampleLectures.title);
    setSummary(sampleLectures.text);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!summary || summary.trim() === "") {
      alert("No summary available to download!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 14;
    const marginRight = 14;
    const textWidth = pageWidth - marginLeft - marginRight;
    const lineHeight = 6.5;

    const renderContent = (startY) => {
      let y = startY;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(20, 20, 20);
      const titleLines = doc.splitTextToSize(inputTitle, textWidth);
      doc.text(titleLines, marginLeft, y);
      y += titleLines.length * 8 + 4;

      doc.setFontSize(12);
      doc.setTextColor(255, 0, 51);
      doc.text("AI Executive Summary & Notes (Powered by EaseYT)", marginLeft, y);
      y += 6;

      doc.setLineWidth(0.5);
      doc.setDrawColor(220, 220, 220);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);

      const cleanText = summary.replace(/\\boxed\{(.*?)\}/g, "$1");
      const lines = doc.splitTextToSize(cleanText, textWidth);
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - 15) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, marginLeft, y);
        y += lineHeight;
      });

      doc.save(`${inputTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_Summary.pdf`);
    };

    const logoImg = new Image();
    logoImg.crossOrigin = "Anonymous";
    logoImg.src = "/easeyt.png";

    logoImg.onload = () => {
      try {
        doc.addImage(logoImg, "PNG", pageWidth - marginRight - 22, 10, 22, 22);
      } catch (e) {
        console.warn("Logo addImage fallback:", e);
      }
      renderContent(24);
    };

    logoImg.onerror = () => {
      renderContent(20);
    };
  };

  const handleTranslateRedirect = () => {
    navigate(`/translate?text=${encodeURIComponent(summary)}&title=${encodeURIComponent(inputTitle)}`);
  };

  return (
    <div className="summary-page-wrapper">
      <GlobalNavbar />

      <main className="summary-page-main">
        {/* Header */}
        <section className="summary-header">
          <div className="summary-badge">
            <FaBrain className="brain-icon" />
            <span>AI Executive Summarizer</span>
          </div>
          <h1 className="summary-page-title">Generate Video Summaries</h1>
          <p className="summary-page-desc">
            Condense lengthy video transcripts and lectures into clean, actionable executive notes.
          </p>
        </section>

        <div className="summary-editor-container">
          {/* Title Bar */}
          <div className="summary-title-card">
            <label className="input-label">Video Title:</label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="title-field"
              placeholder="Enter video or lecture title..."
            />
            <button type="button" className="load-sample-btn" onClick={loadSample}>
              <FaLightbulb /> Load Sample Text
            </button>
          </div>

          {/* Main Card */}
          <div className="summary-main-card">
            <div className="card-toolbar">
              <div className="toolbar-left">
                <span className="editor-status">
                  <FaMagic /> Transcript / Summary Studio
                </span>
              </div>
              <div className="toolbar-right">
                <button className="tool-btn" onClick={copyToClipboard}>
                  {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                </button>
                <button className="tool-btn" onClick={handleTranslateRedirect}>
                  <FaLanguage /> Translate
                </button>
              </div>
            </div>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows="12"
              disabled={loading}
              placeholder="Paste or edit video transcript here, then click 'Generate AI Summary'..."
              className="summary-textarea"
            />

            {/* Action Buttons */}
            <div className="summary-actions-bar">
              <button
                className="action-btn primary-action-btn"
                onClick={generateSummary}
                disabled={loading || !summary.trim()}
              >
                <FaBrain /> {loading ? "Analyzing & Summarizing..." : "Generate AI Summary"}
              </button>
              <button
                className="action-btn export-action-btn"
                onClick={downloadPDF}
                disabled={loading || !summary.trim()}
              >
                <FaFileDownload /> Export Styled PDF
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SummaryPage;
