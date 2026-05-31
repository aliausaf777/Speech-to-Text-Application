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
