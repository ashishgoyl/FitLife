# FitLife Setup & Deployment Guide

This guide walks you through setting up, configuring, and running FitLife locally or deploying it to production.

---

## 📋 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## 🚀 Quick Setup (Development)

### 1. Clone & Enter Project
```bash
git clone https://github.com/ashishgoyal1k-cell/FitLife.git
cd FitLife
```

### 2. Install Dependencies
FitLife is organized as an npm workspace. Running `npm install` at the project root automatically installs and links dependencies for both frontend and backend:
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your keys:
```env
# Google Gemini API Key for live AI Coach
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth 2.0 Client ID for Google Sign-In
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Backend API Port (Default: 5001)
PORT=5001
```

> **Note**: Both keys are optional! If omitted, FitLife seamlessly activates its built-in Smart Health Coach and standard demo login.

### 4. Run Both Frontend and Backend Concurrently
From the root directory, run:
```bash
npm run dev
```

This single command boots:
- **Backend API**: `http://localhost:5001`
- **Frontend App**: `http://localhost:5174`
- **Admin Console**: `http://localhost:5174/admin.html`

The Vite frontend automatically proxies `/api` requests to port `5001`.

---

## 🛠️ Individual Service Commands

You can run individual parts of the stack independently whenever needed:

| Command | Action |
|---|---|
| `npm run dev` | Runs both backend & frontend concurrently |
| `npm run dev:frontend` | Runs only the Vite frontend on `:5174` |
| `npm run dev:backend` | Runs only the Node.js API server on `:5001` |
| `npm run build` | Builds the optimized frontend bundle into `frontend/dist/` |
| `npm run preview` | Previews the production frontend build locally |
| `npm run lint` | Runs the Oxlint linter across frontend source files |
| `npm start` | Starts the production backend server |

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_BACKEND_URL` to your production backend URL (e.g., `https://api.yourdomain.com`).

### Backend (Render / Railway / GCP Cloud Run)
- **Root Directory**: `backend` (or project root with `npm start`)
- **Start Command**: `npm start`
- **Port**: Exposed on `process.env.PORT`
- **Environment Variables**: Set `GEMINI_API_KEY` and any SMS provider keys in your platform's dashboard.

