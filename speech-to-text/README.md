# voxscript — Speech-to-Text App

A full-stack speech-to-text web app built with **Next.js** (frontend) + **Flask** (backend) + **Deepgram** API.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Python, Flask, Flask-CORS |
| Audio processing | pydub (ffmpeg) |
| STT API | Deepgram nova-2 |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Prerequisites

- Node.js 18+
- Python 3.9+
- **ffmpeg** installed on your machine (required by pydub)
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt install ffmpeg`
  - Windows: download from https://ffmpeg.org/download.html and add to PATH
- A free [Deepgram account](https://console.deepgram.com/) — grab your API key from the dashboard

---

## 1. Clone & Setup

```bash
git clone <your-repo-url>
cd speech-to-text
```

---

## 2. Backend Setup

```bash
cd backend

# Create and activate virtualenv
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# → Open .env and paste your Deepgram API key
```

**Start the backend:**

```bash
python app.py
# Running on http://localhost:5000
```

Test it:
```bash
curl http://localhost:5000/health
# {"status": "ok"}
```

---

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local
# → NEXT_PUBLIC_API_URL=http://localhost:5000 (already set)
```

**Start the frontend:**

```bash
npm run dev
# Open http://localhost:3000
```

---

## 4. Using the App

1. Open http://localhost:3000
2. Click **start recording** — allow microphone access when prompted
3. Speak clearly into your mic
4. Click **stop & transcribe**
5. Your transcript appears below — copy or download it
6. View all session transcripts at http://localhost:3000/history

---

## Project Structure

```
speech-to-text/
├── backend/
│   ├── app.py              # Flask API (transcribe, history endpoints)
│   ├── requirements.txt
│   ├── Procfile            # For Render/Heroku deployment
│   └── .env.example
└── frontend/
    ├── pages/
    │   ├── index.js        # Recorder + live transcript
    │   └── history.js      # Session transcript history
    ├── components/
    │   ├── Header.js
    │   ├── RecorderPanel.js
    │   └── TranscriptPanel.js
    ├── styles/globals.css
    ├── tailwind.config.js
    └── .env.local.example
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/transcribe` | Upload audio file, returns transcript |
| GET | `/transcripts` | List all session transcripts |
| DELETE | `/transcripts/:id` | Delete a transcript |

**POST /transcribe** — accepts `multipart/form-data` with a `file` field.

```json
// Response
{
  "transcript": "Hello this is my transcribed text.",
  "id": 1
}
```

---

## Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add environment variable: `DEEPGRAM_API_KEY=your_key`
6. Deploy!

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com`
4. Deploy!

---

## Getting a Deepgram API Key (Free)

1. Sign up at https://console.deepgram.com/
2. You get **$200 free credit** — more than enough to build and test
3. Go to **API Keys** → Create a new key
4. Copy and paste it into `backend/.env`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pydub` conversion fails | Make sure `ffmpeg` is installed and in your PATH |
| Mic permission denied | Click the lock icon in your browser and allow microphone |
| CORS error | Make sure backend is running on port 5000 and `NEXT_PUBLIC_API_URL` is set correctly |
| Deepgram 401 error | Check your API key in `backend/.env` |
| Empty transcript | Try speaking louder/closer to mic; check audio was recorded (download wav to verify) |
