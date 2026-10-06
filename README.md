# Campus Placement Preparation Tracker

A full-stack MERN app to track **aptitude practice**, **coding practice**, and **mock interviews**
for campus placement prep — with a composite **Readiness Score**, a **leaderboard**, and automatic
**weak-area detection**.

## Tech stack

- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Recharts, Axios, lucide-react icons
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens), bcrypt password hashing

## Folder structure

```
campus-placement-tracker/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/     # Route handlers (auth, aptitude, coding, interview, dashboard)
│   ├── middleware/       # JWT auth guard + centralized error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── seed/             # Sample aptitude questions + coding problems
│   ├── utils/
│   │   ├── rankingEngine.js       # Composite Readiness Score + leaderboard sort
│   │   └── weakAreaDetector.js    # Per-topic mastery scoring + weak-area flags
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js           # Axios instance with JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── charts/            # Radar / Line / Bar chart wrappers (Recharts)
        │   ├── Sidebar.jsx, Topbar.jsx, StatCard.jsx, ReadinessGauge.jsx ...
        ├── pages/
        │   ├── Login.jsx, Register.jsx
        │   ├── Dashboard.jsx       # Readiness gauge + mastery radar + weak areas
        │   ├── Aptitude.jsx        # Category-wise quiz + accuracy trend
        │   ├── Coding.jsx          # Problem list + solve logging + topic bar chart
        │   ├── MockInterview.jsx   # Score sliders per round + trend line
        │   └── Leaderboard.jsx     # Ranked table by Readiness Score
        └── App.jsx
```

## How the ranking & weak-area logic works

**Readiness Score (0–1000)** — `backend/utils/rankingEngine.js`
- Aptitude component: average accuracy + a small bonus for consistent practice volume
- Coding component: difficulty-weighted solve rate blended with self-rated confidence
- Interview component: average overall mock interview score
- Weighted: `Aptitude 30% + Coding 45% + Interview 25%`, scaled to 1000

**Weak-area detection** — `backend/utils/weakAreaDetector.js`
- Every practiced topic/category/round gets a 0–100 mastery score
- Anything below **60** is flagged as a weak area with a targeted tip
- Feeds both the dashboard's weak-area list and the radar chart

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm run seed               # loads sample aptitude questions + coding problems
npm run dev                 # starts on http://localhost:5000
```

You need a running MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster —
just paste its connection string into `MONGO_URI` in `.env`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start logging practice sessions.
Register a couple of test accounts to see the leaderboard populate.

## Hosting (Vercel + MongoDB Atlas)

The frontend and Express API deploy together as one Vercel project. The root `server.js` exports the API app, while the Vite build places the frontend in Vercel's `public` directory.

1. Import the repository in Vercel and keep the project root directory set to the repository root, not `frontend` or `backend`.
2. Add `MONGO_URI` and `JWT_SECRET` in Vercel's Project Settings under Environment Variables. You can also set `JWT_EXPIRES_IN` (for example, `7d`) and `CLIENT_URL` if needed. Keep secrets out of GitHub.
3. Deploy. The frontend uses same-origin `/api` requests, so `VITE_API_URL` does not need to be configured.
4. In MongoDB Atlas, allow connections from the deployment environment. Prefer limiting access to known outbound IPs when available; for a student demo, a strong database password and a database user with restricted permissions are especially important if broad access is required.

Vercel runs Express as a Function, so the API connects to MongoDB on demand and reuses the connection while the Function instance stays warm. Static frontend files are served from Vercel's CDN, and non-API routes fall back to the React app.

The sample `npm run seed` command clears and recreates the aptitude-question and coding-problem collections. Do not run it against a database containing data you want to keep. To add only missing aptitude questions, run `npm run seed:aptitude` from `backend`.

## Environment variables (`backend/.env`)

| Variable         | Description                                  |
|------------------|-----------------------------------------------|
| `PORT`           | Backend port (default 5000)                   |
| `MONGO_URI`      | MongoDB connection string                       |
| `JWT_SECRET`     | Long random string used to sign JWTs           |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                       |
| `CLIENT_URL`     | Frontend origin, for CORS                        |

## API overview

| Method | Route                        | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/api/auth/register`          | Create account, returns JWT            |
| POST   | `/api/auth/login`             | Login, returns JWT                     |
| GET    | `/api/auth/me`                | Current user profile                    |
| GET    | `/api/aptitude/questions`     | Random question set by category        |
| POST   | `/api/aptitude/submit`        | Submit answers, get accuracy + review   |
| GET    | `/api/coding/problems`        | Problem list, optional topic filter     |
| POST   | `/api/coding/log`             | Log a solve/attempt                      |
| POST   | `/api/interview/log`          | Log a mock interview round's scores      |
| GET    | `/api/dashboard/summary`      | Readiness score + weak areas + stats     |
| GET    | `/api/dashboard/progress`     | Time-series data for trend charts        |
| GET    | `/api/dashboard/leaderboard`  | Ranked list of all users                  |

## Design notes

The UI uses a dark "exam scorecard" theme — navy/charcoal surfaces, an amber accent (like a
highlighter marker), teal for positive signals, and a coral for weak areas — with a signature
circular **Readiness Gauge** styled after a hall-ticket stamp. Charts use Recharts (radar for
mastery mapping, line for trends, bar for topic comparisons).
