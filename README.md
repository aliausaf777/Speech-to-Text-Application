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
****
# How to Upload voxscript to GitHub

A step-by-step guide to publishing your project on GitHub.

---

## Part 1 — One-Time Setup

### Step 1 — Create a GitHub account

If you don't have one:
1. Go to **github.com**
2. Click **Sign up**
3. Choose a username, email, and password
4. Verify your email

### Step 2 — Install Git on Windows

1. Go to **git-scm.com/download/win**
2. Download and run the installer
3. Click **Next** through all steps (defaults are fine)
4. Open a new terminal and verify:
```cmd
git --version
# Should print: git version 2.x.x
```

### Step 3 — Configure Git with your identity

In terminal, run these (use your GitHub email and name):
```cmd
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## Part 2 — Create a GitHub Repository

1. Go to **github.com** and log in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name:** `voxscript`
   - **Description:** `Full-stack speech-to-text app with Next.js and Flask`
   - **Visibility:** Public (so others can see it)
   - ❌ Do NOT check "Add a README" (we already have one)
4. Click **Create repository**
5. Copy the URL shown — it looks like:
   ```
   https://github.com/YOUR_USERNAME/voxscript.git
   ```

---

## Part 3 — Prepare Your Project

### Step 1 — Make sure .gitignore is in place

Your project already has a `.gitignore` file that excludes:
- `venv/` (Python virtual environment — too large)
- `node_modules/` (npm packages — too large)
- `.env` and `.env.local` (your secret API keys — never upload these)

### Step 2 — Double check your secrets are NOT exposed

Make sure these files exist but are NOT uploaded:
- `backend/.env` ← contains your Deepgram key (blocked by .gitignore ✅)
- `frontend/.env.local` ← contains your API URL (blocked by .gitignore ✅)

The files that ARE uploaded are:
- `backend/.env.example` ← template with no real keys ✅
- `frontend/.env.local.example` ← template with no real keys ✅

---

## Part 4 — Upload to GitHub

Open terminal and navigate to your project root:
```cmd
cd "C:\Users\Mac World\OneDrive\Desktop\speech-to-text\speech-to-text"
```

Run these commands one by one:

### 1 — Initialize Git
```cmd
git init
```

### 2 — Add all files
```cmd
git add .
```

### 3 — Check what's being added (optional but good practice)
```cmd
git status
```
Make sure you don't see `.env` or `.env.local` in the list. Only `.env.example` files should appear.

### 4 — Make your first commit
```cmd
git commit -m "Initial commit - voxscript speech to text app"
```

### 5 — Connect to your GitHub repository
```cmd
git remote add origin https://github.com/YOUR_USERNAME/voxscript.git
```
Replace `YOUR_USERNAME` with your actual GitHub username.

### 6 — Push to GitHub
```cmd
git branch -M main
git push -u origin main
```

It will ask for your GitHub username and password.

> ⚠️ **Note:** GitHub no longer accepts your account password here. You need a **Personal Access Token** instead. See below.

---

## Part 5 — GitHub Personal Access Token (for pushing)

GitHub requires a token instead of your password:

1. Go to **github.com** → click your profile picture (top right)
2. Click **Settings**
3. Scroll down → click **Developer settings** (bottom left)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token (classic)**
6. Give it a name like `voxscript-upload`
7. Set expiration to **90 days**
8. Check the **repo** checkbox (full repo access)
9. Click **Generate token**
10. **Copy the token immediately** — you won't see it again!

When Git asks for your password, paste this token instead of your account password.

---

## Part 6 — Verify It Worked

1. Go to `https://github.com/YOUR_USERNAME/voxscript`
2. You should see all your files
3. The README will display automatically on the page

---

## Part 7 — Updating Your Repo in the Future

Every time you make changes and want to save them to GitHub:

```cmd
cd "C:\Users\Mac World\OneDrive\Desktop\speech-to-text\speech-to-text"

git add .
git commit -m "describe what you changed here"
git push
```

---

## Part 8 — How Someone Else Runs Your Project

Anyone who clones your repo will follow these steps:

```cmd
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/voxscript.git
cd voxscript

# 2. Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env
# → Open .env and add Deepgram API key
python app.py

# 3. Frontend (new terminal)
cd frontend
npm install
copy .env.local.example .env.local
# → .env.local already set to localhost:5000
npm run dev
```

Then open `http://localhost:3000`

---

## Useful Git Commands

| Command | What it does |
|---------|-------------|
| `git status` | See what files have changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save a snapshot with a description |
| `git push` | Upload to GitHub |
| `git pull` | Download latest from GitHub |
| `git log --oneline` | See commit history |
| `git diff` | See exactly what changed |

---

## Tips for a Good GitHub Profile

- Write a clear commit message every time (not just "update" or "fix")
- Keep your README updated as the project grows
- Add screenshots of your app to the README to impress viewers
- Use issues and projects tab to track future features
## 📄 License

MIT License — feel free to use, modify and distribute.

---

<div align="center">
Built with ❤️ using Next.js, Flask and Deepgram
</div>
