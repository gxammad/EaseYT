import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./OverviewPage.css";
import ContactForm from "../components/ContactForm";
import GlobalNavbar from "../components/GlobalNavbar";
import Footer from "../components/Footer";


const TypewriterText = ({ text }) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setTypedText(""); // Clear previous text

    const interval = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 100); // Adjust speed here

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text]);

  return <p className="typewriter-text-ov">{typedText}</p>;
};

const FeaturesSection = () => {
  const modelContainerRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const container = modelContainerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 1, 4);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      process.env.PUBLIC_URL + "/models/me.glb",
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.position.set(0, 0, 0);
        loadedModel.scale.set(0.5, 0.5, 0.5);
        loadedModel.rotation.y = -Math.PI / 2;
        scene.add(loadedModel);
        modelRef.current = loadedModel;
      },
      undefined,
      (err) => {
        console.warn("Could not load 3D model:", err);
      }
    );

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Add neon light glow
    const neonLight = new THREE.PointLight(0xff0000, 6, 6);
    neonLight.position.set(0, 1, -2);
    scene.add(neonLight);

    // Animate model movement
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle mouse movement (limited movement range)
    const onMouseMove = (event) => {
      if (!modelRef.current) return;
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth - 0.5) * 0.5;
      const y = -(clientY / window.innerHeight - 0.5) * 0.3;

      modelRef.current.rotation.y = -Math.PI / 2 + x;
      modelRef.current.rotation.x = y;
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      if (container) {
        container.innerHTML = "";
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section className="features-section">
      <div className="features-text">
        <h2>🚀 What Ease YT Offers</h2>
        <ul>
          <li> AI-Powered Video Summaries</li>
          <li> Multilingual Translations</li>
          <li> Speech-to-Text Transcription</li>
          <li> Structured Document Creation</li>
        </ul>
      </div>
      <div className="features-model" ref={modelContainerRef}></div>
    </section>
  );
};


const OverviewPage = () => {
  const [activeCard, setActiveCard] = useState(null);

  //contact us form
  

  // Information for the cards
  const infoData = [
    {
      title: "🔥 How Ease YT Works",
      details:
        "Ease YT transcribes YouTube videos using AI-powered speech-to-text. Users can translate, summarize, and structure the content into well-formatted documents.",
    },
    {
      title: "💡 Meet Our Team",
      details:
        "Our team consists of talented developers, AI researchers, and UX designers working together to make video understanding more accessible.",
    },
    {
      title: "🚀 Tech Stack",
      details:
        "Ease YT is built using React (Frontend), Node.js & Flask (Backend), MongoDB (Database), and AI-powered APIs for transcription, translation, and summarization.",
    },
    {
      title: "🌍 Open Source",
      details:
        "Ease YT is open-source! Contribute, improve, or explore the codebase on GitHub. Join us in making video comprehension seamless.",
    },
  ];
  const videos = [
    {
      id: "EPwOPr2xkYo",
      title: "Wahab Stuns Hosts ICC 2019",
      thumbnail: "https://img.youtube.com/vi/EPwOPr2xkYo/hqdefault.jpg",
    },
    {
      id: "bEB8-SWMYhI",
      title: "32 Minutes of English",
      thumbnail: "https://img.youtube.com/vi/bEB8-SWMYhI/hqdefault.jpg",
    },
    {
      id: "CWdsqvg0wCw",
      title: "Mystery of Yeti SOLVED!",
      thumbnail: "https://img.youtube.com/vi/CWdsqvg0wCw/hqdefault.jpg",
    },
  ];
  
  return (
    <div className="overview-container">
      <GlobalNavbar />

      {/* Typewriter Effect */}
      <div className="typewriter-container">
        <TypewriterText text="AI-Powered Video Understanding Made Easy..." />
      </div>

      {/* Features Section with 3D Model */}
      <FeaturesSection />

      <section className="info-sections">
      {infoData.map((item, index) => (
        <div
          key={index}
          className={`info-card neon-hover ${activeCard === index ? "active" : ""}`}
          onClick={() => setActiveCard(activeCard === index ? null : index)}
        >
          <h3>{item.title}</h3>
          {activeCard === index && <p className="card-details">{item.details}</p>}
        </div>
      ))}
    </section>

    <section className="videos">
      <h2> 📽️ Videos By EaseYT</h2>
      <div className="video-cards">
        {videos.map((video, index) => (
          <Link key={index} to={`/video/${video.id}`} className="video-card">
            <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
            <p className="video-titlez">{video.title}</p>
          </Link>
        ))}
      </div>
    </section>

    <div className="tcn"><h2>🔗 Trusted By</h2> </div>
    <section className="trusted-companies">
     <div className="logos-wrapper">
     <div className="company-logos">
      <img src="/assets/am.png" alt="Company 1" />
      <img src="/assets/go.png" alt="Company 2" />
      <img src="/assets/ma.png" alt="Company 3" />
      <img src="/assets/ms.png" alt="Company 4" />
      <img src="/assets/yo.png" alt="Company 5" />
      {/* Duplicate logos for a seamless loop */}
      <img src="/assets/am.png" alt="Company 1" />
      <img src="/assets/go.png" alt="Company 2" />
      <img src="/assets/ma.png" alt="Company 3" />
      <img src="/assets/ms.png" alt="Company 4" />
      <img src="/assets/yo.png" alt="Company 5" />
       </div>
      </div>
      </section>

      <section className="api-section">
      <h2>🔧 APIs We Use</h2>
      <div className="api-list">
     <div className="api-card">
      <img src="/assets/tr.png" alt="Assembly AI" />
      <p>Translation</p>
       </div>
       
        <div className="api-card">
      <img src="/assets/cs.png" alt="OpenAI" />
      <p>Cloud Storage</p>
        </div>
        <div className="api-card-1">
      <img src="/assets/yu.png" alt="YouTube API" />
      <p>YouTube</p>
       </div>
        
        <div className="api-card">
      <img src="/assets/st.png" alt="OpenAI" />
      <p>Speech-To-Text</p>
        </div>
        
        <div className="api-card">
      <img src="/assets/ds.png" alt="Deepseek" />
      <p>Deepseek</p>
        </div>
        
     </div>
      </section>
      {/* Contact Us Section */}
      <ContactForm />

      <Footer />
    </div>
  );
};

export default OverviewPage;
