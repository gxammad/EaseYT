import React, { useEffect, useRef, Suspense } from "react";
import "./Overview.css";

const Overview = () => {
  const whaleRef = useRef(null);

  useEffect(() => {
    // Smooth scroll effect for 3D model movement
    const handleScroll = () => {
      if (whaleRef.current) {
        whaleRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overview-container">
      {/* Blurry Header */}
      <header className="blurry-header">
        <h1>Ease YT - The Future of Video Understanding</h1>
      </header>

      {/* Flying Robot (3D Model) */}
      <div className="floating-robot">
        <Canvas>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <FlyingRobot />
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Text with Fade-in Effect (Alternative to Typewriter) */}
      <div className="text-fade">
        <h2 className="fade-in">Making YouTube Videos More Accessible</h2>
        <h2 className="fade-in">Breaking Language Barriers</h2>
        <h2 className="fade-in">Summarizing Content in Seconds</h2>
      </div>

      {/* Video Cards Section */}
      <section className="video-cards">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="video-card">
            <img src="/assets/video-thumbnail.jpg" alt="Video Thumbnail" />
            <h3>Video Title {index + 1}</h3>
            <p>Short description of the video.</p>
          </div>
        ))}
      </section>

      {/* Information Sections */}
      <section className="info-sections">
        <div className="info-card">🔥 How Ease YT Works</div>
        <div className="info-card">💡 Meet Our Team</div>
        <div className="info-card">🚀 Development Languages</div>
        <div className="info-card">🌍 Open Source on GitHub</div>
      </section>

      {/* Trusted Companies */}
      <section className="trusted-companies">
        <h2>Trusted By</h2>
        <div className="company-logos">
          <img src="/assets/company1.png" alt="Company 1" />
          <img src="/assets/company2.png" alt="Company 2" />
          <img src="/assets/company3.png" alt="Company 3" />
        </div>
      </section>

      {/* APIs Used */}
      <section className="api-logos">
        <h2>APIs We Use</h2>
        <div className="api-list">
          <img src="/assets/assemblyai.png" alt="Assembly AI" />
          <img src="/assets/openai.png" alt="OpenAI" />
          <img src="/assets/youtubeapi.png" alt="YouTube API" />
        </div>
      </section>

      {/* Mythic Whale as Background Animation */}
      <div ref={whaleRef} className="background-whale">
        <Canvas>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <MythicWhale />
          </Suspense>
        </Canvas>
      </div>

      {/* Blurry Footer */}
      <footer className="blurry-footer">
        <p>© {new Date().getFullYear()} Ease YT | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Overview;
