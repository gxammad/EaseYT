import React, { useState } from 'react';
import './FAQs.css';
import { FaChevronDown } from 'react-icons/fa';

const FAQS = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I transcribe a YouTube video to text?",
            answer: "Simply provide the YouTube URL and let Ease YT do the work. It will generate an accurate transcription."
        },
        {
            question: "How do I generate and download a text transcript from a YouTube video?",
            answer: "You can generate and download transcripts directly from the transcription page after processing your video."
        },
        {
            question: "Is the YouTube Video Transcript Generator available for free?",
            answer: "Ease YT offers free features for all users"
        },
        {
            question: "What is a YouTube video transcript?",
            answer: "A YouTube video transcript is the text representation of the video’s audio, formatted with timestamps or as plain text."
        },
    ];

    return (
        <section className="faqs-section">
            <h2 className="faqs-title">Frequently Asked Questions (FAQ)</h2>
            <div className="faqs-container">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className="faq-item" 
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            {faq.question}
                            <FaChevronDown 
                                className={`faq-icon ${activeIndex === index ? 'rotate' : ''}`} 
                            />
                        </div>
                        <div 
                            className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQS;
