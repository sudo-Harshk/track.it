# track.it — Technical Architecture

---

## Stack Overview

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + Vite | Fast builds, no SSR needed, pure client-side |
| Routing | React Router v6 | Two routes only — `/` and `/admin` |
| UI Components | shadcn/ui | Accessible, copy-owned, not a black-box library |
| Animations | Framer Motion | Count-up, stagger, tab transitions |
| Charts | Recharts | Lightweight, React-native, mobile-friendly |
| Icons | Lucide React | Consistent 1.5px stroke, tree-shakeable |
| Font | DM Sans (Google Fonts) | Warm, readable, free |
| Backend | Node.js + Express | Simple REST API, minimal overhead |
| Database | Turso (hosted SQLite) | SQLite syntax, no server, free tier |
| Deployment | Vercel | Auto-deploy from GitHub, free tier, serverless |

---

## Project Structure

```
trackit/
├── client/                         # React frontend
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNav.jsx       # Fixed bottom navigation
│   │   │   ├── HeroCard.jsx        # Today's count + quote
│   │   │   ├── StatCard.jsx        # This month / Interviews
│   │   │   ├── ChartCard.jsx       # Weekly bar chart
│   │   │   ├── JobCard.jsx         # Single application card
│   │   │   ├── StatusBadge.jsx     # Colored status pill
│   │   │   └── SkeletonCard.jsx    # Loading state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Tab 1
│   │   │   ├── Jobs.jsx            # Tab 2
│   │   │   └── Admin.jsx           # /admin route
│   │   ├── hooks/
│   │   │   └── useJobs.js          # Data fetching hook
│   │   ├── lib/
│   │   │   ├── api.js              # All API calls
│   │   │   └── quotes.js           # Motivational quotes array + selector
│   │   ├── styles/
│   │   │   └── globals.css         # CSS variables + base styles
│   │   ├── App.jsx                 # Router setup
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Express backend
│   ├── db.js                       # Turso client setup
│   ├── routes/
│   │   ├── jobs.js                 # Job CRUD routes
│   ├── index.js                    # Express app entry
│   └── package.json
│
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## Database Schema

### Turso setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create trackit

# Get connection URL and token
turso db show trackit --url
turso db tokens create trackit
```

### Schema — run once on setup

```sql
CREATE TABLE IF NOT EXISTS jobs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  company     TEXT    NOT NULL,
  role        TEXT    NOT NULL,
  url         TEXT    NOT NULL,
  date_applied TEXT   NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'Applied',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

---

## API Reference

### Base URL
- Development: `http://localhost:3001`
- Production: `https://trackit-api.vercel.app` (or your Vercel URL)

---

### GET `/api/jobs`

Returns all jobs sorted by date descending.

**Response:**
```json
[
  {
    "id": 1,
    "company": "Swiggy",
    "role": "Frontend Developer",
    "url": "https://swiggy.com/careers/123",
    "date_applied": "2026-04-24",
    "status": "Interview",
    "created_at": "2026-04-24T09:30:00.000Z"
  }
]
```

---

### POST `/api/jobs`

Add a new job application.

**Request body:**
```json
{
  "company": "Razorpay",
  "role": "React Engineer",
  "url": "https://razorpay.com/careers/456",
  "date_applied": "2026-04-25",
  "status": "Applied"
}
```

**Response:** `201` with the created job object.

---

### PATCH `/api/jobs/:id`

Update any field of an existing job.

**Request body** (any subset of fields):
```json
{
  "status": "Interview"
}
```

**Response:** `200` with the updated job object.

---

### DELETE `/api/jobs/:id`

Delete a job by ID.

**Response:** `200` with `{ "deleted": true }`

---

## Environment Variables

### Server (`server/.env`)

```env
# Turso
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token-here

# Server
PORT=3001
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:3001
```

### `.env.example` (commit this, not `.env`)

```env
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
PORT=3001
VITE_API_URL=
```

---

## Key Implementation Details

### Quote selector (`client/src/lib/quotes.js`)

```js
export const quotes = [
  "Every application is a step forward.",
  "You only need one yes.",
  "Rejection is redirection.",
  "Progress, not perfection.",
  "The right door is still out there.",
  "Keep going — you're closer than you think.",
  "One application at a time.",
  "Showing up is already winning.",
  "Every no clears the path to yes.",
  "Your effort today is building tomorrow.",
];

export function getTodayQuote() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}
```

### Dashboard stats computed from jobs array

```js
// Today's count
const today = new Date().toISOString().split('T')[0];
const todayCount = jobs.filter(j => j.date_applied === today).length;

// This month's count
const thisMonth = new Date().toISOString().slice(0, 7); // "2026-04"
const monthCount = jobs.filter(j => j.date_applied.startsWith(thisMonth)).length;

// Interview count (this month)
const interviewCount = jobs.filter(
  j => j.date_applied.startsWith(thisMonth) && j.status === 'Interview'
).length;

// This week's daily counts (Mon–Sun)
function getWeekData(jobs) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  return days.map((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    return {
      day,
      count: jobs.filter(j => j.date_applied === dateStr).length,
      isToday: dateStr === today,
    };
  });
}
```

## Deployment

### Vercel setup

1. Push code to GitHub
2. Connect repo to Vercel
3. Set all environment variables in Vercel dashboard
4. Vercel auto-detects Vite frontend and Express backend
5. Every push to `main` triggers auto-deploy

### Vercel project config (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/vite.config.js",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.js" },
    { "src": "/(.*)", "dest": "client/dist/$1" }
  ]
}
```

---

## Third-Party Service Setup

### Turso (database)
1. Sign up at turso.tech
2. Install CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
3. `turso auth login`
4. `turso db create trackit`
5. `turso db show trackit --url` → copy to `TURSO_DATABASE_URL`
6. `turso db tokens create trackit` → copy to `TURSO_AUTH_TOKEN`
7. Run schema SQL using `turso db shell trackit`

## Development Setup

```bash
# Clone and install
git clone https://github.com/you/trackit.git
cd trackit

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install

# Set up env files
cp .env.example server/.env
cp .env.example client/.env
# Fill in all values

# Run both (from root)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:3001`

---
