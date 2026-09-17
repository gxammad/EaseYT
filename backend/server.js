const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const cors = require('cors');
const { getSubtitles } = require('youtube-captions-scraper');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
const fileUpload = require("express-fileupload");
const summaryRoutes = require("./routes/summaryRoutes");
const FormData = require("form-data");
const translateRoutes = require("./routes/translate");
const axios = require('axios');
const fs = require("fs");
const nodemailer = require("nodemailer");
const ytdl = require('ytdl-core'); 

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api", summaryRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/transcribe", transcriptionRoutes);
app.use(upload.single("audio"));

// Deepseek API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("🔑 DEEPSEEK R1 MODEL :", OPENROUTER_API_KEY ? "Loaded ✅" : "Not found ❌");

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/easeyt')
  .then(() => console.log('✅ MongoDB database connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Audio Schema for MongoDB
const audioSchema = new mongoose.Schema({
  videoId: String,
  audioData: Buffer, // Store audio as binary
  timestamp: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
const Audio = mongoose.models.Audio || mongoose.model('Audio', audioSchema);

// Video History Schema
const videoHistorySchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  title: String,
  timestamp: { type: Date, default: Date.now }
});
const VideoHistory = mongoose.models.VideoHistory || mongoose.model('VideoHistory', videoHistorySchema);

// 📌 Route to store video history
app.post('/api/history', async (req, res) => {
  try {
    const { userId, videoId, title } = req.body;

    const existingHistory = await VideoHistory.findOne({ userId, videoId });
    if (existingHistory) {
      return res.status(400).json({ message: 'This video is already in your history.' });
    }

    const newHistory = new VideoHistory({ userId, videoId, title });
    await newHistory.save();
    res.status(201).json({ message: 'Video history added successfully!' });
  } catch (err) {
    console.error("Error storing video history:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 Route to process YouTube video transcription (User-selected range)
app.post("/api/transcribe-youtube", async (req, res) => {
  try {
    const { videoId, startTime, endTime } = req.body;

    // 1️⃣ Check for subtitles first
    try {
      const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
      if (subtitles.length > 0) {
        return res.json({ transcription: subtitles.map(s => s.text).join(" ") });
      }
    } catch (error) {
      console.warn("⚠️ No subtitles found, proceeding with audio extraction...");
    }

    // 2️⃣ No subtitles? Extract user-selected audio range from YouTube
    console.log("🔄 Downloading selected audio range from YouTube...");
    const audioBuffer = await downloadYouTubeAudio(videoId, startTime, endTime);

    if (!audioBuffer) {
      return res.status(500).json({ error: "Failed to extract audio" });
    }

    // 3️⃣ Store audio in MongoDB (Temporarily)
    const savedAudio = new Audio({ videoId, audioData: audioBuffer });
    await savedAudio.save();
    console.log("🗄️ Audio stored in database temporarily");

    // 4️⃣ Send to Whisper for transcription
    const transcription = await transcribeAudioWithWhisper(audioBuffer);

    // 5️⃣ Delete the audio from MongoDB after processing
    await Audio.deleteOne({ _id: savedAudio._id });
    console.log("🗑️ Audio deleted from database after transcription");

    res.json({ transcription });
  } catch (error) {
    console.error("❌ Error transcribing YouTube video:", error.message || error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// 📌 Function to download a selected range of YouTube audio
async function downloadYouTubeAudio(videoId, startTime, endTime) {
  return new Promise((resolve, reject) => {
    const audioChunks = [];
    const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
      quality: 'lowestaudio',
      filter: 'audioonly'
    });

    let totalDuration = 0;
    stream.on('data', chunk => {
      totalDuration += chunk.length;
      audioChunks.push(chunk);
    });

    stream.on('end', () => {
      const fullBuffer = Buffer.concat(audioChunks);
      
      // Extract the selected range (startTime to endTime)
      const sampleRate = 44100; // Standard audio sample rate
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      
      const selectedBuffer = fullBuffer.slice(startSample, endSample);
      resolve(selectedBuffer);
    });

    stream.on('error', reject);
  });
}

// 📌 Function to transcribe audio with Whisper API
async function transcribeAudioWithWhisper(audioBuffer) {
  try {
    const formData = new FormData();
    formData.append("audio", audioBuffer, { filename: "audio.mp3" });

    const response = await axios.post("http://127.0.0.1:5001/api/transcribe", formData, {
      headers: { ...formData.getHeaders() },
    });

    return response.data.transcription;
  } catch (error) {
    console.error("❌ Whisper transcription error:", error);
    throw new Error("Transcription failed");
  }
}

// 📌 Route to get video history by userId
app.get('/api/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await VideoHistory.find({ userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching video history:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 Route to fetch YouTube subtitles
app.get('/api/subtitles/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
    res.json({ success: true, subtitles });
  } catch (error) {
    console.error("❌ Error fetching subtitles:", error.message || error);
    res.status(500).json({ success: false, message: 'Could not load subtitles.' });
  }
});



app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  // Email transporter setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: "malikammad1275@gmail.com",
    subject: `New Contact Form Message: ${subject}`,
    text: `From: ${email}\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ success: false, message: "Failed to send email" });
  }
});


// Default route to check if server is running
app.get('/', (req, res) => {
  res.send('✅ EaseYT Backend is Running!');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
