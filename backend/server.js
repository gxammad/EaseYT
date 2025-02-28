const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { getSubtitles } = require('youtube-captions-scraper');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/easeyt', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB database connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Video History Schema
const videoHistorySchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  title: String,
  timestamp: { type: Date, default: Date.now }
});
const VideoHistory = mongoose.model('VideoHistory', videoHistorySchema);

// 📌 Route to store video history
app.post('/history', async (req, res) => {
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 Route to get video history by userId
app.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await VideoHistory.find({ userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 Route to fetch YouTube subtitles
app.get('/api/subtitles/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  try {
    const subtitles = await getSubtitles({
      videoID: videoId, 
      lang: 'en'  // Change this to another language code if needed
    });

    res.json({ success: true, subtitles });
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({ success: false, message: 'Could not load subtitles.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
