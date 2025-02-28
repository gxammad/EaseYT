const express = require('express');
const { getSubtitles } = require('youtube-captions-scraper');

const router = express.Router();

router.get('/:videoId', async (req, res) => {
    const { videoId } = req.params;
    try {
        const subtitles = await getSubtitles({
            videoID: videoId, 
            lang: 'en' // Change the language if needed
        });
        res.json({ success: true, subtitles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not load subtitles.' });
    }
});

module.exports = router;
