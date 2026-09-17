import whisper
import torch
import os
import yt_dlp
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys

sys.stdout.reconfigure(encoding="utf-8")

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Set Device
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)

# Define upload directory
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")  # Save files inside 'backend/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)  # Create folder if it doesn't exist


def download_audio(video_id):
    """Downloads full YouTube audio and saves it in backend/uploads."""
    try:
        audio_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp3")

        # Check if audio already exists
        if os.path.exists(audio_path):
            print(f"Audio already exists: {audio_path}")
            return audio_path

        print(f"Downloading audio for video ID: {video_id}")

        ydl_opts = {
            "format": "bestaudio/best",
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ],
            "outtmpl": os.path.join(UPLOAD_FOLDER, video_id),  # No ".mp3" to avoid duplicate extensions
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([f"https://www.youtube.com/watch?v={video_id}"])

        # Ensure final file exists
        final_audio_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp3")
        if not os.path.exists(final_audio_path):
            print(f"Error: Audio file {final_audio_path} not found after download.")
            return None

        print(f"Audio downloaded successfully: {final_audio_path}")
        return final_audio_path

    except Exception as e:
        print(f"Error downloading audio: {str(e)}")
        return None


def extract_audio_segment(input_audio, output_audio, start_time, end_time):
    """Extracts a specific segment from the audio using FFmpeg."""
    try:
        print(f"Extracting segment from {start_time} to {end_time}...")

        cmd = [
            "ffmpeg",
            "-y",  # Overwrite existing files
            "-i",
            input_audio,  # Input file
            "-ss",
            start_time,  # Start time
            "-to",
            end_time,  # End time
            "-c",
            "copy",  # Copy codec (faster processing)
            output_audio,
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        if not os.path.exists(output_audio):
            print(f"Error: Extracted segment {output_audio} not found.")
            return None

        print(f"Segment extracted successfully: {output_audio}")
        return output_audio

    except Exception as e:
        print(f"Error extracting audio segment: {str(e)}")
        return None


@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    """Handles transcription request."""
    if (
        "videoId" not in request.json
        or "startTime" not in request.json
        or "endTime" not in request.json
    ):
        return jsonify({"error": "Missing required parameters"}), 400

    video_id = request.json["videoId"]
    start_time = request.json["startTime"]
    end_time = request.json["endTime"]

    try:
        print(f"Received transcription request for video ID: {video_id}")

        # Step 1: Download full audio
        full_audio = download_audio(video_id)
        if not full_audio:
            return jsonify({"error": "Failed to download audio."}), 500

        print(f"Checking if file exists: {full_audio}")
        if not os.path.exists(full_audio):
            return jsonify({"error": f"Audio file {full_audio} not found."}), 500

        # Step 2: Extract selected segment
        segment_audio = os.path.join(UPLOAD_FOLDER, f"{video_id}_segment.mp3")
        segment_audio = extract_audio_segment(full_audio, segment_audio, start_time, end_time)

        if not segment_audio:
            return jsonify({"error": "Failed to extract audio segment."}), 500

        print(f"Checking if segment file exists: {segment_audio}")
        if not os.path.exists(segment_audio):
            return jsonify({"error": f"Segment file {segment_audio} not found."}), 500

        # Step 3: Run Whisper for transcription
        print("Running Whisper transcription...")
        result = model.transcribe(segment_audio)
        transcription = result["text"]

        # Cleanup: Delete audio files after transcription
        os.remove(full_audio)
        os.remove(segment_audio)

        print("Transcription completed successfully.")
        return jsonify(
            {
                "message": "Transcription successful",
                "transcription": transcription,
            }
        )

    except Exception as e:
        error_message = str(e).encode("utf-8", "ignore").decode()
        print(f"Transcription failed: {error_message}")
        return jsonify({"error": "Transcription failed: " + error_message}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
