const express = require('express');
const router = express.Router();
const translateText = require('../controllers/translationService');

// Define the API route
router.get('/', async (req, res) => {
    const { text, targetLang } = req.query;

    // Check for required parameters
    if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing 'text' or 'targetLang' query parameters." });
    }

    try {
        const translatedText = await translateText(text, targetLang);

        if (!translatedText) {
            return res.status(500).json({ error: "Translation failed." });
        }

        res.json({ translatedText });
    } catch (error) {
        console.error('Translation route error:', error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
