require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { OpenAI } = require("openai");
const fs = require("fs");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Fix: Ensure multer correctly handles file uploads
const upload = multer({ dest: "uploads/" });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        // ✅ Fix: Ensure file exists
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const audioPath = req.file.path;
        const audioFile = fs.createReadStream(audioPath);

        console.log("📂 Received file:", req.file.originalname);

        // Call OpenAI Whisper API
        const response = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: audioFile,
            response_format: "json",
            language: "en",
        });

        console.log("✅ Transcription successful!");

        // Remove temporary audio file
        fs.promises.unlink(audioPath)
            .then(() => console.log("🗑️ Temporary file deleted"))
            .catch(err => console.error("❌ Error deleting file:", err));

        res.json({ transcription: response.text });
    } catch (error) {
        console.error("❌ Transcription Error:", error);
        res.status(500).json({ error: "Transcription failed" });
    }
});

module.exports = router;
