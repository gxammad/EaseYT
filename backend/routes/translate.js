const express = require('express');
const router = express.Router();
const translateText = require('../controllers/translationService');

// Define the API route
router.get('/', async (req, res) => {
    // Extract query parameters
    const { text, sourceLang, targetLang } = req.query;

    // Check if required parameters are provided
    if (!text || !sourceLang || !targetLang) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Call the translation function
    const translatedText = await translateText(text, sourceLang, targetLang);
    
    // Check if translation was successful
    if (!translatedText) {
        return res.status(500).json({ error: "Translation failed" });
    }

    // Send the translated text as JSON response
    res.json({ translatedText });
});

module.exports = router;
