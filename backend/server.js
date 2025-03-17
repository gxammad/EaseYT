const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { getSubtitles } = require('youtube-captions-scraper');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
const OpenAI = require("openai");
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT || 5000;
const translateRoutes = require("./routes/translate");



require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/api/translate", translateRoutes);
// Register routes
app.use('/api', transcriptionRoutes);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/easeyt', )
  .then(() => console.log('✅ MongoDB database connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Not found ❌");

// Video History Schema
const videoHistorySchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  title: String,
  timestamp: { type: Date, default: Date.now }
});
const VideoHistory = mongoose.model('VideoHistory', videoHistorySchema);

// 📌 Route to store video history
app.post('/api/history', async (req, res) => {
  try {
    const { userId, videoId, title } = req.body;

    // Prevent duplicate entries
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

// 📌 Route to transcribe uploaded audio file
app.post('/api/transcribe', async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioFile = req.files.audio;

    // Send audio to OpenAI Whisper
    const response = await openai.audio.transcriptions.create({
      file: audioFile.data,
      model: "whisper-1"
    });

    res.json({ transcription: response.text });
  } catch (error) {
    console.error("Error in transcription:", error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

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
    const subtitles = await getSubtitles({
      videoID: videoId, 
      lang: 'en' 
    });

    res.json({ success: true, subtitles });
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({ success: false, message: 'Could not load subtitles.' });
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
