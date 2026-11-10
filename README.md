# FitLife — Smart Health & Nutrition Tracking Platform

> An all-in-one personal health, nutrition, and fitness tracking web application featuring Indian food calorie tracking, BMR & macro targets, hydration logs, sleep analytics, workout routines, and an AI Health Coach.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📁 Clean & Simple Project Structure

FitLife is organized into clear, decoupled folders:

```
FitLife/
├── frontend/             # React 19 + Vite client application
├── backend/              # Node.js REST API server & microservices
├── documentation/        # Architecture, API, and setup documentation
├── scripts/              # Full-stack developer scripts
├── .env                  # Local environment configuration
└── package.json          # Root workspace configuration
```

- 🎨 **[frontend/](file:///Users/ashishgoyal/Downloads/FitLife-main/frontend)**: Contains all React components, styling, Indian food data, and Vite configuration.
- ⚙️ **[backend/](file:///Users/ashishgoyal/Downloads/FitLife-main/backend)**: Contains the standalone REST API server (`port 5001`), controllers, and services (Gemini AI, OTP dispatch, Google Auth).
- 📚 **[documentation/](file:///Users/ashishgoyal/Downloads/FitLife-main/documentation)**: Complete project guides and architectural specs.

---

## 🚀 Quick Start

### 1. Install Dependencies
FitLife uses npm workspaces to manage both frontend and backend dependencies:
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` to configure your Gemini API Key or Google Sign-In:
```bash
cp .env.example .env
```

### 3. Start Both Frontend and Backend Concurrently
Run this single command from the project root:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5174](http://localhost:5174)
- **Admin Console**: [http://localhost:5174/admin.html](http://localhost:5174/admin.html)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 📖 Documentation Index

For in-depth explanations and developer guides, explore the `documentation/` folder:

- 🏛️ **[Architecture & System Design](file:///Users/ashishgoyal/Downloads/FitLife-main/documentation/ARCHITECTURE.md)**: System diagram, directory breakdown, and data flow.
- 🔌 **[Backend REST API Reference](file:///Users/ashishgoyal/Downloads/FitLife-main/documentation/API_DOCUMENTATION.md)**: Full API spec for AI Coach, OTPs, and configuration endpoints.
- 🛠️ **[Setup & Deployment Guide](file:///Users/ashishgoyal/Downloads/FitLife-main/documentation/SETUP_GUIDE.md)**: Local development, production builds, and cloud deployment.
- ✨ **[Features Overview](file:///Users/ashishgoyal/Downloads/FitLife-main/documentation/FEATURES_OVERVIEW.md)**: Detailed walkthrough of food tracking, hydration, sleep, workouts, and AI coach.

---

## 🛠️ Individual Commands

| Command | Description |
|---|---|
| `npm run dev` | Runs backend (:5001) and frontend (:5174) concurrently |
| `npm run dev:frontend` | Runs only the Vite frontend dev server |
| `npm run dev:backend` | Runs only the Node.js backend server |
| `npm run build` | Builds optimized frontend bundle into `frontend/dist/` |
| `npm run lint` | Runs the Oxlint linter on frontend code |
| `npm start` | Starts the production backend server |

---

## 📄 License

MIT © [Ashish Goyal](https://github.com/ashishgoyal1k-cell)
