const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { exec } = require("child_process");
const { SpeechClient } = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");

ffmpeg.setFfmpegPath(ffmpegPath);
const client = new SpeechClient({ keyFilename: "easeyt-66dd6930aac3.json" });
const storage = new Storage({ keyFilename: "easeyt-79ba914b2e82.json" });

const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Download full audio with yt-dlp
const downloadFullAudio = (videoId, audioPath) => {
  const command = `yt-dlp -x --audio-format mp3 -o "${audioPath}.%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("yt-dlp error:", stderr);
        return reject(new Error("Failed to download audio."));
      }
      const finalPath = `${audioPath}.mp3`;
      if (!fs.existsSync(finalPath)) return reject(new Error("Downloaded MP3 not found."));
      resolve(finalPath);
    });
  });
};

// Extract segment using FFmpeg
const extractAudioSegment = (input, output, start, end) => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .setStartTime(start)
      .setDuration(end - start)
      .output(output)
      .audioCodec("copy")
      .on("end", () => {
        if (!fs.existsSync(output)) return reject(new Error("Segment not created."));
        resolve(output);
      })
      .on("error", reject)
      .run();
  });
};

exports.transcribeFromYouTube = async (req, res) => {
  const { videoId, startTime, endTime, languageCode } = req.body; // Added languageCode here

  if (!videoId) return res.status(400).json({ error: "Video ID is required." });

  const timestamp = Date.now();
  const baseName = `${videoId}-${timestamp}`;
  const fullAudioBase = path.join(UPLOAD_DIR, baseName);
  const fullAudioPath = `${fullAudioBase}.mp3`;
  const segmentPath = path.join(UPLOAD_DIR, `${baseName}_segment.mp3`);
  const wavPath = path.join(UPLOAD_DIR, `${baseName}.wav`);

  try {
    console.log("🔹 Downloading full audio...");
    await downloadFullAudio(videoId, fullAudioBase);

    const startSec = startTime !== undefined ? Number(startTime) : 0;
    const endSec = endTime !== undefined ? Number(endTime) : 0;

    let audioToTranscribe;

    if (startSec === 0 && endSec === 0) {
      console.log("📢 Transcribing full audio...");
      audioToTranscribe = fullAudioPath;
    } else {
      if (endSec <= startSec) throw new Error("Invalid time range.");
      console.log("✂️ Extracting audio segment...");
      await extractAudioSegment(fullAudioPath, segmentPath, startSec, endSec);
      audioToTranscribe = segmentPath;
    }

    console.log("🎛 Converting audio to WAV...");
    await new Promise((resolve, reject) => {
      ffmpeg(audioToTranscribe)
        .output(wavPath)
        .audioCodec("pcm_s16le")
        .audioChannels(1)
        .audioFrequency(16000)
        .format("wav")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    const bucketName = "easeyt-audio-files";
    const gcsFileName = `${baseName}.wav`;
    const gcsUri = `gs://${bucketName}/${gcsFileName}`;

    await storage.bucket(bucketName).upload(wavPath, { destination: gcsFileName });
    console.log("📤 Uploaded to GCS:", gcsUri);

    const longRequest = {
      audio: { uri: gcsUri },
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: languageCode || "en-US", // Default to "en-US" if no language is provided
      },
    };

    console.log("🧠 Transcribing with Google STT...");
    const [operation] = await client.longRunningRecognize(longRequest);
    const [response] = await operation.promise();
    const transcript = response.results.map(r => r.alternatives[0].transcript).join("\n");

    console.log("✅ Transcription done.");
    res.json({ transcript });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  } finally {
    [fullAudioPath, segmentPath, wavPath].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlink(file, err => {
          if (err) console.error(`Failed to delete ${file}:`, err);
          else console.log(`🧹 Deleted file: ${file}`);
        });
      }
    });
  }
};
