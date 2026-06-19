import os
import tempfile
import requests
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "")

transcripts = []
transcript_id_counter = 1


def transcribe_with_deepgram(audio_data: bytes, mime_type: str) -> str:
    if not DEEPGRAM_API_KEY:
        raise ValueError("DEEPGRAM_API_KEY is not set. Add it to your .env file.")

    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": mime_type,
    }
    params = {
        "model": "nova-2",
        "smart_format": "true",
        "punctuate": "true",
    }
    response = requests.post(
        "https://api.deepgram.com/v1/listen",
        headers=headers,
        params=params,
        data=audio_data,
        timeout=60,
    )
    response.raise_for_status()
    result = response.json()
    transcript = (
        result.get("results", {})
        .get("channels", [{}])[0]
        .get("alternatives", [{}])[0]
        .get("transcript", "")
    )
    return transcript


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    global transcript_id_counter

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No audio file provided."}), 400

    audio_data = file.read()
    mime_type = file.content_type or "audio/webm"

    try:
        text = transcribe_with_deepgram(audio_data, mime_type)
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except requests.HTTPError as e:
        return jsonify({"error": f"Deepgram API error: {e.response.text}"}), 502
    except Exception as e:
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

    entry = {
        "id": transcript_id_counter,
        "text": text,
        "filename": file.filename,
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
    }
    transcripts.append(entry)
    transcript_id_counter += 1

    return jsonify({"transcript": text, "id": entry["id"]})


@app.route("/transcripts", methods=["GET"])
def get_transcripts():
    return jsonify({"transcripts": list(reversed(transcripts))})


@app.route("/transcripts/<int:tid>", methods=["DELETE"])
def delete_transcript(tid):
    global transcripts
    transcripts = [t for t in transcripts if t["id"] != tid]
    return jsonify({"deleted": tid})


if __name__ == "__main__":
    app.run(debug=True, port=5000)