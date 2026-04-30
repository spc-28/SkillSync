
# SkillSync 🎓

> Find your team. Build something great. — An AI-powered campus collaboration platform.

---

## What is SkillSync?

SkillSync is a campus networking platform built to solve the age-old problem of finding the right teammates. Students create verified skill profiles, post project ideas, and let an AI matching engine surface the most compatible collaborators — then hop straight into a shared workspace to get building.

No more cold DMs. No more mismatched teams. Just the right people, at the right time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Backend** | NestJS (Node.js) |
| **Real-time** | Socket.IO |
| **Auth & Database** | Firebase Auth, Firestore |
| **AI / Embeddings** | Google Gemini API |

---

## Features

### 🔐 Verified Campus Auth
Sign in with your institutional account via Firebase Auth. Profiles are tied to verified student identities, keeping the network trusted and campus-scoped.

### 🤖 AI-Powered Teammate Matching
Teammate recommendations powered by Google Gemini API embeddings. The matching engine analyzes skill complementarity (not just overlap), project interests, and availability to surface the most relevant collaborators — not just whoever's online.

### 💬 Real-time Team Chat
Socket.IO-powered team workspaces with persistent messaging. Channels are scoped per project, so conversations stay organized from ideation to delivery.

### ✅ Integrated Task Management
Built-in task board within each team workspace. Create, assign, and track work without bouncing between tools.

### 🧠 AI Coding Assistant
In-workspace AI coding assistance powered by Gemini — ask questions, get code suggestions, and unblock teammates without leaving SkillSync.

### 🧩 Skill & Project Profiles
Students list skills with proficiency levels and specify what they're looking to build. Project posts include required skills, timeline, and team size — giving the matcher everything it needs.

---

## Architecture

```
Browser (Next.js)
      │
      ├── REST API calls ──────────────► NestJS Backend
      │                                       │
      └── WebSocket (Socket.IO) ◄────────────►│
                                              ├── Firestore (state / messages)
                                              ├── Firebase Auth (identity)
                                              └── Gemini API (embeddings + AI)
```

- **NestJS** handles REST endpoints, WebSocket gateways, and Gemini integration in a modular, decorator-driven architecture.
- **Firestore** stores user profiles, project posts, team channels, and task state with real-time sync.
- **Gemini embeddings** are computed on profile creation/update and compared at match time using cosine similarity to rank teammate candidates.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Auth + Firestore enabled
- A Google Gemini API key ([get one here](https://aistudio.google.com/))

### 1. Clone the repo

```bash
git clone https://github.com/spc-28/SkillSync.git
cd SkillSync
```

### 2. Set up the backend (NestJS)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3001

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# CORS
FRONTEND_URL=http://localhost:3000
```

Run locally:

```bash
npm run start:dev
```

### 3. Set up the frontend (Next.js)

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Firebase client config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Run locally:

```bash
npm run dev
```


---

## How Matching Works

```
1. On profile save  →  Skill tags + bio sent to Gemini embeddings endpoint
2. Data stored    →  Saved to Firestore alongside user document
3. On match request →  Requester's data fetched
4. Scoring          →  Similarity computed against all campus profiles
5. Filters applied  →  Availability, project type, team size preference
6. Ranked list      →  Top-N recommendations returned to frontend
```

The goal isn't to match people with the *same* skills — it's to find teams where the skills *complement* each other. A frontend-heavy requester gets ranked higher against full-stack or backend profiles.

---

<p align="center">Built with ❤️ by <a href="https://github.com/spc-28">Shardul Chorghade</a></p>
