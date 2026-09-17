// routes/transcriptionRoutes.js

const express = require("express");
const router = express.Router();
const { transcribeFromYouTube } = require("../controllers/transcriptionController");

router.post("/google", transcribeFromYouTube);

module.exports = router;
