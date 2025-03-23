require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Store API key in .env

router.post("/generate-summary", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required for summarization." });
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-r1-zero:free", // ✅ Correct DeepSeek R1 model
                messages: [
                    { role: "system", content: "Summarize the given text clearly and concisely." },
                    { role: "user", content: text }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://yourwebsite.com", // 🔹 Replace with your actual website
                    "X-Title": "Ease YT" // 🔹 Custom title for OpenRouter
                }
            }
        );

        const summary = response.data.choices?.[0]?.message?.content || "No summary generated.";
        res.json({ summary });
    } catch (error) {
        console.error("Error generating summary:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate summary. Please try again." });
    }
});

module.exports = router;
