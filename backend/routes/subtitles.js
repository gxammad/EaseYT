const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core'); // For extracting audio
const speechToText = require('@google-cloud/speech'); // Google Speech-to-Text
const router = express.Router();

const YOUTUBE_API_KEY = 'AIzaSyCboPqNrU0li8JKGv6lw4epHXEQV_9bLWQ';
const speechClient = new speechToText.SpeechClient();

// Fetch subtitles for a video in a specific language
router.get('/:videoId', async (req, res) => {
    const { videoId } = req.params;
    const { lang = 'en' } = req.query;

    try {
        // Step 1: Fetch caption tracks for the video
        const captionsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/captions`,
            {
                params: {
                    part: 'snippet',
                    videoId: videoId,
                    key: YOUTUBE_API_KEY,
                },
            }
        );

        // Step 2: Find the caption track for the requested language
        const captionTrack = captionsResponse.data.items.find(
            (item) => item.snippet.language === lang
        );

        if (captionTrack) {
            // Step 3: Download the subtitles
            const subtitlesResponse = await axios.get(captionTrack.snippet.downloadUrl);
            return res.json({ success: true, subtitles: subtitlesResponse.data });
        }

        // Step 4: Fallback to auto-generated subtitles
        const autoCaptionTrack = captionsResponse.data.items.find(
            (item) => item.snippet.trackKind === 'ASR' && item.snippet.language === lang
        );

        if (autoCaptionTrack) {
            const subtitlesResponse = await axios.get(autoCaptionTrack.snippet.downloadUrl);
            return res.json({ success: true, subtitles: subtitlesResponse.data });
        }

        // Step 5: Fallback to speech-to-text
        const audioStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
        const transcription = await transcribeAudio(audioStream, lang);
        return res.json({ success: true, subtitles: transcription });
    } catch (error) {
        console.error('Error fetching subtitles:', error);
        res.status(500).json({
            success: false,
            message: 'Could not load subtitles.',
        });
    }
});

// Transcribe audio using Google Speech-to-Text
const transcribeAudio = async (audioStream, lang) => {
    const request = {
        audio: { content: audioStream },
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: lang,
        },
    };

    const [response] = await speechClient.recognize(request);
    return response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');
};

module.exports = router;