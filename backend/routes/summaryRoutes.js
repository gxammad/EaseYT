require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

router.post("/generate-summary", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        console.error("❌ No text provided for summarization.");
        return res.status(400).json({ error: "Text is required for summarization." });
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-r1-0528:free", // 
                messages: [
                    { role: "system", content: "Summarize the following text, condensing it to about one-third of the original text" },
                    { role: "user", content: text }
                ],
            
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://yourwebsite.com", 
                    "X-Title": "Ease YT"
                }
            }
        );

        const summary = response.data.choices?.[0]?.message?.content || "Ease YT server is busy😞 Please try again later⏳ ";
        res.json({ summary });
    } catch (error) {
        console.error("❌ Error generating summary:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate summary. Please try again." });
    }
});

module.exports = router;
