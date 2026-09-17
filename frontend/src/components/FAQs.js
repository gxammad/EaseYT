import React, { useState } from 'react';
import './FAQs.css';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const faqs = [
  {
    question: "How does EaseYT transcribe YouTube videos to text?",
    answer: "Simply paste the YouTube video link or search for the title in EaseYT. Our pipeline extracts the video audio stream and converts spoken dialogue into timestamped transcriptions with speaker clarity."
  },
  {
    question: "Can I download transcripts as a formatted PDF?",
    answer: "Yes! With one click on the 'Download PDF' button, EaseYT generates a beautifully formatted document with video metadata, section headings, and clean transcription text ready for studying or sharing."
  },
  {
    question: "How does the AI video summarization work?",
    answer: "EaseYT analyzes full video transcripts to generate concise executive summaries, bullet points of key takeaways, and action items so you can grasp an hour-long video in under 2 minutes."
  },
  {
    question: "What languages can I translate video subtitles into?",
    answer: "We support over 80 languages including Spanish, French, German, Japanese, Chinese, Arabic, Hindi, and Urdu with neural translation accuracy."
  },
  {
    question: "Is EaseYT free to use?",
    answer: "Yes! EaseYT provides core search, transcription previews, translation, and summary generation tools for all users without requiring a credit card."
  }
];

const FAQS = () => {
  const [activeIndex, setActiveIndex] = useState(0); // first item open by default

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faqs-section">
      <div className="faqs-container">
        <div className="faqs-header">
          <span className="faqs-badge"><FaQuestionCircle /> Got Questions?</span>
          <h2 className="faqs-title">Frequently Asked Questions</h2>
          <p className="faqs-subtitle">
            Find answers to common questions about transcription, translations, and PDF downloads.
          </p>
        </div>

        <div className="faqs-list">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <div className={`faq-icon-circle ${isOpen ? 'active' : ''}`}>
                    <FaChevronDown className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQS;
