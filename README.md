# EaseYT 🎬⚡
> **AI-Powered YouTube Video Transcriber, Multilingual Translator & Executive Summary PDF Generator**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gxammad/EaseYT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Production%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 What is EaseYT?

**EaseYT** is a modern, next-generation web application designed to eliminate language barriers and cut down hours of video consumption into seconds. 

Whether you are a student studying hours of lectures, a professional reviewing webinars, or a creator repurposing content, EaseYT provides an end-to-end AI intelligence pipeline:
- 🔍 **Instant Video Search & URL Parsing**: Direct YouTube search or 1-click video ID / link ingestion.
- 🎙️ **Speech-to-Text Transcription**: Extract clear dialogue with timestamp clipping and live typewriter display.
- 🌍 **80+ Language Translations**: Translate transcripts into Spanish, French, German, Urdu, Arabic, Japanese, Hindi, and more.
- 🧠 **AI Executive Summaries**: Condense long transcripts into key bullet points and core takeaways.
- 📄 **Branded PDF Export**: Download formatted, professional study and briefing documents with 1 click.
- 🕶️ **Cyber-Dark UI / UX**: High-performance glassmorphic interface with interactive 3D WebGL models and smooth responsive controls.

---

## 🚀 Live Demo & Vercel Deployment

EaseYT is fully pre-configured for automated **Vercel** deployment with zero configuration required.

### Deploying on Vercel:
1. Fork or push this repository to your GitHub account (`https://github.com/gxammad/EaseYT.git`).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" -> "Project"**.
3. Import your **`EaseYT`** repository.
4. **Build and Output Settings**:
   - Vercel automatically detects Create React App and the root `vercel.json`.
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build --prefix frontend` (or auto-detected)
   - **Output Directory**: `frontend/build` (or auto-detected)
5. Click **Deploy**! 🚀
6. Direct client-side routes (`/search`, `/video/:id`, `/summary`, `/translate`, `/history`, `/OverviewPage`) will work seamlessly without 404s thanks to the integrated SPA rewrites in `vercel.json`.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Core**: React 18, React Router v7
- **Styling**: Modern Cyber-Dark Glassmorphism, CSS Modules, Inter & Space Grotesk typography
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei` (Interactive 3D viewport)
- **Document Generation**: `jsPDF`, `jspdf-autotable`
- **Icons**: `react-icons` (FontAwesome, Feather)
- **Animations**: CSS Hardware-Accelerated Transitions & Keyframe Glows

### **Backend (Microservices)**
- **API Server**: Node.js, Express.js
- **Audio & Subtitle Extraction**: `youtube-transcript`, `ytdl-core`, `youtube-captions-scraper`
- **AI Speech Recognition**: Python Whisper Speech Engine & Google Cloud Speech API
- **Translation**: Google Cloud Translate API & OpenRouter / OpenAI LLM APIs

---

## 📂 Project Structure

```text
EaseYT/
├── frontend/                       # React 18 Single-Page Application
│   ├── public/                     # Static assets, 3D GLTF models, branding
│   │   ├── models/                 # 3D assets (me.glb)
│   │   ├── assets/                 # Brand logos
│   │   ├── easeyt.png              # Primary App Logo
│   │   └── index.html              # HTML5 Template
│   ├── src/
│   │   ├── components/
│   │   │   ├── GlobalNavbar.js     # Unified Responsive Navigation Bar
│   │   │   ├── MainContent.js      # Hero Section with Visual Preview
│   │   │   ├── Stats.js            # Key Metrics & Video Showcase
│   │   │   ├── Features.js         # Core Capabilities Grid
│   │   │   ├── MeetMyTeam.js       # Team Member Showcase
│   │   │   ├── FAQs.js             # Interactive Accordion FAQs
│   │   │   ├── Footer.js           # Multi-column Global Footer
│   │   │   └── ContactForm.js      # In-app Contact Form
│   │   ├── pages/
│   │   │   ├── SearchPage.js       # YouTube Search & Topic Discovery
│   │   │   ├── VideoPage.js        # Cinema Player & Transcription Studio
│   │   │   ├── SummaryPage.js      # AI Summary Generator & PDF Exporter
│   │   │   ├── TranslationPage.js  # Dual-Pane Multilingual Translation
│   │   │   ├── HistoryPage.js      # Watch & Transcription Session Log
│   │   │   └── OverviewPage.js     # 3D Model Showcase & Tech Stack
│   │   ├── index.css               # Global Theme, Variables & Scrollbars
│   │   └── App.js                  # Route Configuration & Suspense
│   ├── vercel.json                 # Frontend SPA Rewrites Configuration
│   └── package.json
│
├── backend/                        # Node.js & Python Services
│   ├── controllers/                # API Request Handlers
│   ├── routes/                     # REST Endpoints
│   ├── server.js                   # Express Backend Entrypoint
│   ├── whisper_service.py          # Python Whisper Offline STT Pipeline
│   └── package.json
│
├── vercel.json                     # Monorepo Vercel Build & Route Config
├── package.json                    # Root Orchestration Scripts
└── README.md                       # Documentation & Setup Guide
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Git](https://git-scm.com/)
- Optional: [Python 3.9+](https://www.python.org/) for local Whisper model execution

### 1. Clone the Repository
```bash
git clone https://github.com/gxammad/EaseYT.git
cd EaseYT
```

### 2. Install Dependencies
```bash
# Install root orchestration tools
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies (optional for local API)
cd backend
npm install
cd ..
```

### 3. Run the Development Server
To launch both frontend and backend concurrently:
```bash
npm start
```
Or run the frontend independently:
```bash
cd frontend
npm start
```
The frontend will launch at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Builds an optimized production bundle in `frontend/build`.

---

## 👥 Team & Acknowledgments

- **Ahmer Naseer** — Senior Project Manager
- **Nabiha Hanook** — Technical Documentation & Quality Assurance
- **Ammad Waqas** — Lead Full-Stack & AI Systems Developer

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.