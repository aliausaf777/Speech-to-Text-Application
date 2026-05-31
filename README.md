<div align="center">

# 🎙️ voxscript

**A full-stack Speech-to-Text web app**

Record your voice → get accurate text instantly, powered by Deepgram AI

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-blue?style=flat-square&logo=flask)
![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=flat-square&logo=python)
![Deepgram](https://img.shields.io/badge/Deepgram-nova--2-purple?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

</div>

---

## ✨ Features

- 🎤 **One-click recording** — record directly from your browser
- ⚡ **Instant transcription** — powered by Deepgram nova-2 model
- 📋 **Copy & download** — export transcripts as .txt
- 📜 **Session history** — view, manage and delete past transcripts
- 📱 **Mobile friendly** — works on phone browsers too
- 🎨 **Clean UI** — minimal design with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Python, Flask, Flask-CORS |
| Speech-to-Text | Deepgram nova-2 API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
voxscript/
├── backend/
│   ├── app.py                # Flask API
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # For Render deployment
│   ├── .env.example          # Environment variable template
│   └── .gitignore
└── frontend/
    ├── pages/
    │   ├── _app.js           # App entry point
    │   ├── index.js          # Recorder page
    │   └── history.js        # Transcript history page
    ├── components/
    │   ├── Header.js         # Navigation header
    │   ├── RecorderPanel.js  # Mic recording component
    │   └── TranscriptPanel.js# Transcript display component
    ├── styles/
    │   └── globals.css       # Global styles + Tailwind
    ├── package.json
    ├── tailwind.config.js
    ├── next.config.js
    └── .env.local.example    # Frontend env template
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Python 3.9–3.12](https://www.python.org/) ⚠️ Python 3.13 not recommended
- [Git](https://git-scm.com/)
- A free [Deepgram account](https://console.deepgram.com/) for your API key

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/voxscript.git
cd voxscript
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env
```

Open `.env` and add your Deepgram API key:
```
DEEPGRAM_API_KEY=your_actual_key_here
```

Start the backend:
```bash
python app.py
# → Running on http://localhost:5000
```

Verify it works:
```
http://localhost:5000/health
# Should return: {"status": "ok"}
```

### 3. Frontend setup

Open a **second terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Create your .env.local file
# Windows:
copy .env.local.example .env.local
# macOS/Linux:
cp .env.local.example .env.local
```

`.env.local` should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
# → Open http://localhost:3000
```

---

## 🔑 Getting a Free Deepgram API Key

1. Go to [console.deepgram.com](https://console.deepgram.com/) and sign up
2. You get **$200 free credit** — plenty for development and testing
3. Navigate to **API Keys** → click **Create a new API key**
4. Copy the key and paste it into `backend/.env`

---

## 📱 Using on Mobile (same WiFi)

You can use your phone's microphone to record:

1. Find your PC's IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address under Wi-Fi (e.g. 192.168.1.4)

   # macOS/Linux
   ifconfig
   ```

2. Update `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.4:5000
   ```

3. Start frontend with network access:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

4. Open on your phone (same WiFi):
   ```
   http://192.168.1.4:3000
   ```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/transcribe` | Upload audio → returns transcript |
| `GET` | `/transcripts` | List all session transcripts |
| `DELETE` | `/transcripts/:id` | Delete a transcript |

**POST /transcribe** accepts `multipart/form-data` with a `file` field:

```json
{
  "transcript": "Your transcribed text appears here.",
  "id": 1
}
```

---

## ☁️ Deployment

### Backend → Render (free)

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, select the `backend/` folder
4. Set these values:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add environment variable: `DEEPGRAM_API_KEY` = your key
6. Click **Deploy**
7. Copy your Render URL (e.g. `https://voxscript.onrender.com`)

### Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Click **Deploy**

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `No module named 'audioop'` | You're on Python 3.13 — downgrade to 3.11 or 3.12 |
| Empty transcripts | Check your Deepgram API key is correctly set in `.env` |
| Mic permission denied | Click the 🔒 lock icon in browser → set Microphone to Allow |
| CORS error | Make sure `NEXT_PUBLIC_API_URL` matches your backend URL exactly |
| Deepgram 401 error | Your API key is invalid or not set — check `backend/.env` |
| Phone can't reach app | Make sure phone and PC are on the same WiFi network |
| `python app.py` fails | Make sure your virtualenv is activated before running |

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

<div align="center">
Built with ❤️ using Next.js, Flask and Deepgram
</div>
