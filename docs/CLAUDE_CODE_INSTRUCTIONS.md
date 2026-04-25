# track.it — Claude Code Build Instructions

This document is the single source of truth for building track.it from scratch. Read all four documentation files before writing a single line of code. Then build in the exact order below.

## Documentation to read first

1. `PRD.md` — what we are building and why
2. `DESIGN_SYSTEM.md` — every color, font, spacing, and component spec
3. `ARCHITECTURE.md` — stack, folder structure, API, environment setup
4. `APP_FLOW.md` — every screen, every user action, every state

---

## Before you start

### Accounts needed (set these up manually before running the build)

1. **Turso** — turso.tech — create a database called `trackit`, get the URL and auth token
2. **Vercel** — vercel.com — connect your GitHub repo

### Environment files needed

Create `server/.env` with:
```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
PORT=3001
```

Create `client/.env` with:
```
VITE_API_URL=http://localhost:3001
```

---

## Build order — follow this exactly

### Phase 1 — Project scaffold

```
1. Create root folder: trackit/
2. Create client/ using: npm create vite@latest client -- --template react
3. Create server/ with manual package.json
4. Set up .gitignore (node_modules, .env, dist)
5. Create .env.example with all keys empty
```

---

### Phase 2 — Backend

Build the entire backend before touching the frontend.

#### 2.1 — Install server dependencies

```bash
cd server
npm install express @libsql/client dotenv cors
npm install -D nodemon
```

#### 2.2 — Database setup (`server/db.js`)

```js
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      company      TEXT NOT NULL,
      role         TEXT NOT NULL,
      url          TEXT NOT NULL,
      date_applied TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'Applied',
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
```

#### 2.3 — Jobs routes (`server/routes/jobs.js`)

Implement all four endpoints:
- `GET /api/jobs` — `SELECT * FROM jobs ORDER BY date_applied DESC, created_at DESC`
- `POST /api/jobs` — insert, return created row
- `PATCH /api/jobs/:id` — update any provided fields, return updated row
- `DELETE /api/jobs/:id` — delete by id, return `{ deleted: true }`

Validate required fields on POST. Return 400 with helpful message if missing.

#### 2.5 — Express app (`server/index.js`)

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import jobsRouter from './routes/jobs.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/jobs', jobsRouter);

initDB().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  });
});
```

#### 2.6 — Test all endpoints

Use curl or a REST client to verify all six endpoints work before moving to frontend.

---

### Phase 3 — Frontend setup

#### 3.1 — Install client dependencies

```bash
cd client
npm install react-router-dom framer-motion recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
```

shadcn init options:
- Style: Default
- Base color: Stone
- CSS variables: Yes

#### 3.2 — Add DM Sans font

In `client/index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### 3.3 — CSS variables (`client/src/styles/globals.css`)

Add all CSS variables from `DESIGN_SYSTEM.md`. Set `font-family: 'DM Sans', sans-serif` on `body`. Set `background: var(--color-bg-page)` on `body`.

#### 3.4 — API client (`client/src/lib/api.js`)

One file, all API calls. Use `VITE_API_URL` env var as base. Export named functions:
- `getJobs()`
- `addJob(data)`
- `updateJob(id, data)`
- `deleteJob(id)`

#### 3.5 — Quotes (`client/src/lib/quotes.js`)

Implement the quotes array and `getTodayQuote()` function as specified in `ARCHITECTURE.md`.

---

### Phase 4 — Components

Build all shared components before building pages.

#### 4.1 — StatusBadge.jsx

Props: `status` (string)
Renders a pill with correct background + text color from design system.
All caps, 10px, 600 weight, 0.06em letter-spacing.

#### 4.2 — StatCard.jsx

Props: `label`, `value`, `hint`
Renders a white card with uppercase label, large number, small hint text.
Exact specs from DESIGN_SYSTEM.md.

#### 4.3 — ChartCard.jsx

Props: `weekData` (array of `{ day, count, isToday }`)
Renders the weekly bar chart using Recharts BarChart.
Today's bar: `#C2622D`. Other bars: `#E8DDD5`.
Day labels below bars: 9px, `#A8A29E`.
No axis lines. No grid lines. Clean.

#### 4.4 — JobCard.jsx

Props: `job`, `isAdmin` (bool), `onEdit`, `onDelete`
- Always shows: company, role, status badge, date, "View posting →" link
- If `isAdmin`: shows edit (Pencil) and delete (Trash2) icons
- "View posting →" opens job.url in new tab
- ExternalLink icon (12px) next to "View posting" text

#### 4.5 — HeroCard.jsx

Props: `count`, `quote`
- Terracotta background
- "JOBS APPLIED TODAY" uppercase label
- Large animated count number (Framer Motion count-up, 0 → count, 600ms)
- Quote text fades in after 500ms delay

#### 4.6 — SkeletonCard.jsx

Renders a shimmer placeholder card. Same height as a JobCard.
Use CSS animation as specified in DESIGN_SYSTEM.md.

#### 4.7 — BottomNav.jsx

Props: `activeTab`, `onTabChange`
Two items: Dashboard, Jobs.
Active item: terracotta color + small dot below label.
Fixed to bottom. White background. 0.5px top border.

---

### Phase 5 — Pages

#### 5.1 — App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Fetch jobs once here
// Pass data down via props to public routes
// Admin fetches its own data independently

export default function App() {
  // useState for jobs, loading
  // useEffect to fetch on mount
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout jobs={jobs} loading={loading} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### 5.2 — PublicLayout.jsx

Wraps Dashboard and Jobs with bottom navigation.
Manages `activeTab` state.
Renders the correct page based on active tab.

#### 5.3 — Dashboard.jsx

Props: `jobs`, `loading`

Compute client-side: `todayCount`, `monthCount`, `interviewCount`, `weekData`

Layout (top to bottom with Framer Motion stagger):
1. Greeting (time-aware: morning/afternoon/evening)
2. Page title "Your job hunt"
3. HeroCard
4. Two StatCards side by side (CSS grid, 2 columns)
5. ChartCard

If loading: show SkeletonCard components in place of each section.

#### 5.4 — Jobs.jsx

Props: `jobs`, `loading`

State: `activeFilter` ('All' | 'Applied' | 'Interview' | 'Offer' | 'Rejected')

Layout:
1. Page title "Applications"
2. Filter pills row (horizontal scroll if needed)
3. Filtered jobs list — JobCard for each
4. Empty state if filtered list is empty

Filter pill styles:
- Active: terracotta background, white text
- Inactive: white background, muted text, border

#### 5.6 — Admin.jsx

Self-contained. Fetches its own data on mount. Does not share state with public routes.

Sections (single scrollable page):
1. Header — "track.it" + small "admin" badge
2. Add application form
3. "Your applications" heading + job list with edit/delete

Form state: `useState` for each field.
Edit state: `useState` for which card is in edit mode (null | jobId).
Delete confirm state: `useState` for which card is confirming (null | jobId).

On successful add: clear form, prepend new job to list.
On successful edit: update job in list, close edit mode.
On successful delete: remove job from list, close confirm.

---

### Phase 6 — Animations

Apply Framer Motion animations as specified in DESIGN_SYSTEM.md:

1. **Hero count-up** — in HeroCard.jsx, animate displayed number from 0 to prop value
2. **Quote fade-in** — in HeroCard.jsx, `opacity: 0 → 1` with 500ms delay
3. **Card stagger** — in Dashboard.jsx, wrap each section in `motion.div` with stagger
4. **Tab transition** — in PublicLayout.jsx, wrap page content in AnimatePresence
5. **Status badge pop** — in StatusBadge.jsx, animate on status prop change

---

### Phase 7 — Vercel deployment

#### 7.1 — `vercel.json` (root)

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

#### 7.2 — Update client `.env` for production

In Vercel dashboard, set:
```
VITE_API_URL=https://your-vercel-url.vercel.app
```

And all server environment variables.

#### 7.3 — Push to GitHub, connect to Vercel

Vercel auto-detects and deploys. Every push to `main` auto-deploys.

---

## Quality checklist before shipping

### Mobile
- [ ] All screens tested on 375px viewport (iPhone SE)
- [ ] Today's count visible without scrolling
- [ ] All touch targets minimum 44px
- [ ] Bottom nav never overlaps content
- [ ] Keyboard does not hide submit button on admin form

### Data
- [ ] Empty state shows correctly when no jobs
- [ ] Filter pills work correctly for all statuses
- [ ] "View posting →" opens in new tab
- [ ] Date defaults to today on add form
- [ ] Status defaults to Applied on add form

### Animations
- [ ] Count-up runs on initial load
- [ ] Quote fades in after number
- [ ] Cards stagger in smoothly
- [ ] Tab transitions feel snappy not sluggish

### Admin
- [ ] Can add a job
- [ ] Can edit status
- [ ] Can delete with confirmation
- [ ] Form clears after successful submit
- [ ] Errors are shown inline, not as alerts

### Performance
- [ ] App loads in under 2 seconds on 4G
- [ ] Images/fonts do not block render
- [ ] No console errors in production

---

## That is it

Read the four docs. Build in phase order. Check the checklist. Ship it.
