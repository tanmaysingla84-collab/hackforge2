# Geeta University Parent-Student Portal (Demo)

Production-style full-stack demo for a **Geeta University Parent-Student Engagement Portal** (Panipat, Haryana).

## Tech
- **Frontend**: React + Vite, Recharts, html2canvas, react-hot-toast
- **Backend**: Node.js + Express, in-memory seeded data (no DB)
- **AI**: Anthropic Claude API (model: `claude-sonnet-4-5`) via backend proxy

## Project structure
```
geeta-portal/
  frontend/
  backend/
```

## Setup

### 1) Backend
From `geeta-portal/backend/`:
```bash
npm install
copy .env.example .env
```
Edit `.env`:
```
ANTHROPIC_API_KEY=YOUR_KEY
PORT=5000
```

Run:
```bash
npm run dev
```

### 2) Frontend
From `geeta-portal/frontend/`:
```bash
npm install
npm run dev
```

Open the app at Vite’s printed URL (usually `http://localhost:5173`).

## Demo logins

### Parent login (`/login/parent`)
- `parent1` / `GU@parent1` → Arjun Sharma (CSE)
- `parent2` / `GU@parent2` → Priya Singh (ECE)
- `parent3` / `GU@parent3` → Rahul Verma (ME)

### Student login (`/login/student`)
- `2210001` / `GU@2210001` → Arjun Sharma
- `2210002` / `GU@2210002` → Priya Singh
- `2210003` / `GU@2210003` → Rahul Verma

## What to try (walkthrough)
- **Login** as parent/student.
- Dashboard loads instantly with:
  - Marks table (color-coded by %)
  - Trend chart (Recharts)
  - Attendance rings (alerts below 75%)
  - **Smart Alert Banner** auto-fires on page load + toast
- Parent view:
  - **AI Academic Insights** → calls backend `/api/insights` (Claude)
  - **Weekly Digest** → calls backend `/api/digest` (Claude), renders a 390px card, download as PNG
- Messages:
  - Use **Messages** link in header
  - Teacher messages are pre-seeded for Arjun (`2210001`)
  - Parent/student replies are stored in-memory (backend store)

## Backend API
- `GET  /api/student/:id`
- `GET  /api/student/:id/alerts`
- `POST /api/insights` body `{ studentId }`
- `POST /api/digest` body `{ studentId }`
- `GET  /api/messages/:studentId`
- `POST /api/messages` body `{ studentId, sender: "parent"|"student"|"teacher", text }`

## Notes
- If `ANTHROPIC_API_KEY` is missing, `/api/insights` and `/api/digest` return a safe demo fallback so the UI still works.

# Geeta University Parent-Student Engagement Portal

A full-stack, production-ready portal allowing parents and students to monitor academic progress through data-driven visual dashboards and Claude-powered AI Insights.

## Features
- **Smart Alert System**: Immediate alerts for >15% score drops or <75% attendance.
- **AI Academic Insights**: Connects securely to the Anthropic Claude API for actionable advice and tips.
- **Weekly Digest Canvas**: Downloadable summary PNG cards powered by AI and `html2canvas`.
- **Real-time Messaging Thread**: Parent-Teacher communication simulation.

---

## Technical Stack
- **Frontend**: React (Vite), Vanilla CSS styling, Recharts (Charts), Lucide-React (Icons), React Router.
- **Backend**: Node.js, Express, `@anthropic-ai/sdk`.

---

## Setup & Execution

### 1. Environment Configuration
Create a `.env` file at the ROOT of the `geeta-portal` directory. Use the structure:
```env
ANTHROPIC_API_KEY="your_claude_api_key_here"
```

### 2. Running the Backend
1. Open a terminal.
2. Navigate to `geeta-portal/backend`
3. Install dependencies: `npm install`
4. Start the server (runs on Port 5000): `node server.js`

### 3. Running the Frontend
1. Open a new terminal.
2. Navigate to `geeta-portal/frontend`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Open your browser to `http://localhost:5173`

---

## Demo Walkthrough & Logins

**Parent Login (`http://localhost:5173/login/parent`)**
- Full access to visualization and AI Generation buttons.
- Pre-seeded Credentials:
  - `parent1` / `GU@parent1` → Arjun Sharma 
  - `parent2` / `GU@parent2` → Priya Singh 
  - `parent3` / `GU@parent3` → Rahul Verma 

**Student Login (`http://localhost:5173/login/student`)**
- Read-only dashboard view without AI Insight initiation.
- Pre-seeded Credentials:
  - `2210001` / `GU@2210001` → Arjun Sharma
  - `2210002` / `GU@2210002` → Priya Singh
  - `2210003` / `GU@2210003` → Rahul Verma
