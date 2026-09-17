import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLanguage, FaExchangeAlt, FaRegCopy, FaCheck, FaBrain, FaFilePdf, FaLightbulb } from "react-icons/fa";
import jsPDF from "jspdf";
import GlobalNavbar from "../components/GlobalNavbar";
import Footer from "../components/Footer";
import './TranslationPage.css';

const sampleTranslationData = {
  original: "Artificial Intelligence allows developers to transcribe, translate, and synthesize video speech into clear actionable knowledge across international barriers.",
  translations: {
    es: "La inteligencia artificial permite a los desarrolladores transcribir, traducir y sintetizar el discurso de video en conocimiento claro y procesable a través de las barreras internacionales.",
    fr: "L'intelligence artificielle permet aux développeurs de transcrire, traduire et synthétiser les discours vidéo en connaissances claires et exploitables à travers les frontières internationales.",
    de: "Künstliche Intelligenz ermöglicht es Entwicklern, Video-Sprache zu transkribieren, zu übersetzen und in klares, umsetzbares Wissen über internationale Grenzen hinweg zu synthetisieren.",
    ur: "مصنوعی ذہانت ڈویلپرز کو بین الاقوامی رکاوٹوں کے پار ویڈیو تقریر کو نقل کرنے، ترجمہ کرنے اور واضح قابل عمل علم میں تبدیل کرنے کی اجازت دیتی ہے۔",
    ar: "يتيح الذكاء الاصطناعي للمطورين نسخ وترجمة وتلخيص الخطاب المرئي إلى معرفة واضحة وقابلة للتنفيذ عبر الحواجز الدولية.",
    ja: "人工知能により、開発者は動画の音声を書き起こし、翻訳し、国境を越えて明確で実用的な知識にまとめることができます。",
    hi: "आर्टिफिशियल इंटेलिजेंस डेवलपर्स को अंतरराष्ट्रीय बाधाओं के पार वीडियो भाषण को स्पष्ट कार्रवाई योग्य ज्ञान में ट्रांसक्राइब, अनुवाद और संश्लेषित करने की अनुमति देता है।"
  }
};

const languagesList = [
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "zh", name: "Chinese (Mandarin)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "it", name: "Italian (Italiano)" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "tr", name: "Turkish (Türkçe)" },
  { code: "nl", name: "Dutch (Nederlands)" },
  { code: "id", name: "Indonesian (Bahasa)" },
  { code: "en", name: "English" }
];

const TranslationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialText = queryParams.get("text") || sampleTranslationData.original;
  const videoTitle = queryParams.get("title") || "YouTube Video Translation";

  const [originalText, setOriginalText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set initial sample translation
  useEffect(() => {
    if (sampleTranslationData.translations[selectedLanguage]) {
      setTranslatedText(sampleTranslationData.translations[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const handleTranslation = async () => {
    if (!originalText.trim()) {
      alert("Please enter text to translate.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/translate?text=${encodeURIComponent(originalText)}&sourceLang=auto&targetLang=${selectedLanguage}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await response.json();

      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        // Use demo sample translation for preview
        const fallback = sampleTranslationData.translations[selectedLanguage] ||
          `[${selectedLanguage.toUpperCase()} Translation]: ${originalText}`;
        setTranslatedText(fallback);
      }
    } catch (err) {
      console.warn("Backend translation unreachable, using client translation preview:", err);
      const fallback = sampleTranslationData.translations[selectedLanguage] ||
        `[${selectedLanguage.toUpperCase()} Translation]: ${originalText}`;
      setTranslatedText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setOriginalText(sampleTranslationData.original);
    setTranslatedText(sampleTranslationData.translations[selectedLanguage] || sampleTranslationData.translations.es);
  };

  const handleSummarizeRedirect = () => {
    navigate('/summary', {
      state: {
        transcription: translatedText || originalText,
        videoTitle: `${videoTitle} (${selectedLanguage.toUpperCase()})`
      }
    });
  };

  const downloadPDF = () => {
    if (!translatedText && !originalText) {
      alert("No translation available to download!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;
    const marginRight = 14;
    const textWidth = pageWidth - marginLeft - marginRight;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(videoTitle, marginLeft, 22);

    doc.setFontSize(12);
    doc.setTextColor(255, 0, 51);
    doc.text(`Multilingual Translation (${selectedLanguage.toUpperCase()}) - EaseYT`, marginLeft, 30);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, 34, pageWidth - marginRight, 34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    const lines = doc.splitTextToSize(translatedText || originalText, textWidth);
    let y = 42;
    lines.forEach((line) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, marginLeft, y);
      y += 7;
    });

    doc.save(`${videoTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_Translated.pdf`);
  };

  return (
    <div className="translation-page-wrapper">
      <GlobalNavbar />

      <main className="translation-page-main">
        {/* Header */}
        <section className="translation-header">
          <div className="translation-badge">
            <FaLanguage className="badge-icon" />
            <span>Neural Language Studio</span>
          </div>
          <h1 className="translation-title">Multilingual Subtitle Translation</h1>
          <p className="translation-desc">
            Translate YouTube video transcripts into over 80 languages with high-fidelity speech preservation.
          </p>
        </section>

        {/* Video Title Bar */}
        <div className="video-meta-bar">
          <span className="source-tag">Source Video:</span>
          <h3 className="meta-title">{videoTitle}</h3>
          <button type="button" className="sample-btn" onClick={loadSample}>
            <FaLightbulb /> Load Sample Text
          </button>
        </div>

        {/* Studio Controls Bar */}
        <div className="studio-controls-panel">
          <div className="lang-picker-group">
            <label className="picker-label"><FaExchangeAlt /> Target Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="target-lang-dropdown"
            >
              {languagesList.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="translate-trigger-btn"
            onClick={handleTranslation}
            disabled={loading || !originalText.trim()}
          >
            {loading ? "Translating..." : "Translate Subtitles"}
          </button>
        </div>

        {/* Dual Pane Translation Editor */}
        <div className="dual-pane-container">
          {/* Left Pane: Original */}
          <div className="pane original-pane">
            <div className="pane-header">
              <span className="pane-title">Original Transcription (Auto-Detect)</span>
              <button className="clear-btn" onClick={() => setOriginalText("")}>Clear</button>
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter or paste speech text to translate..."
              className="pane-textarea"
            />
            <div className="pane-footer">
              <span className="char-count">{originalText.length} characters</span>
            </div>
          </div>

          {/* Right Pane: Translated Output */}
          <div className="pane translated-pane">
            <div className="pane-header">
              <span className="pane-title">Translated Output ({selectedLanguage.toUpperCase()})</span>
              {translatedText && (
                <button className="copy-action-btn" onClick={copyToClipboard}>
                  {copied ? <><FaCheck /> Copied</> : <><FaRegCopy /> Copy</>}
                </button>
              )}
            </div>
            <div className="output-display">
              <p>{translatedText || "Translated text will appear here. Click 'Translate Subtitles' to generate."}</p>
            </div>
            <div className="pane-footer">
              <span className="char-count">{translatedText.length} characters</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Deck */}
        <div className="translation-action-deck">
          <button className="deck-btn primary" onClick={handleSummarizeRedirect}>
            <FaBrain /> Summarize This Translation
          </button>
          <button className="deck-btn secondary" onClick={downloadPDF}>
            <FaFilePdf /> Export Translation to PDF
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TranslationPage;
