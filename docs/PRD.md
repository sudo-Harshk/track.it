# track.it — Product Requirements Document

**Version:** 1.0  
**Status:** Ready for build  
**Last updated:** April 2026  

---

## 1. Problem Statement

Job hunting is a daily grind with no visibility. Family members ask the same questions every day — "How many jobs did you apply to today?" — and the person hunting has to manually explain and remember numbers.

There is no single place that answers these questions passively, without the job hunter having to do anything beyond logging their work.

---

## 2. Solution

**track.it** is a personal job hunt tracker. One person maintains it. Up to ten family members view it. It is a live window into the job search — always up to date, always on mobile, always one tap away.

The job hunter logs every application from an admin page. Family members open a public link and see everything they would ever ask about — today's count, monthly count, and application statuses — without asking a single question.

---

## 3. Users

| User | Role | Access |
|---|---|---|
| Job hunter (you) | Admin | `/admin` — full read/write |
| Family members (up to 10) | Viewer | `/` — read only |

No authentication. Admin access is by URL only — `/admin` is a secret route only the job hunter knows.

---

## 4. Goals

1. Family members can answer "how many jobs today?" by opening a link — without asking
2. Job hunter can log an application in under 30 seconds
3. Every screen answers its question above the fold — no scrolling to find the answer
4. The app feels personal and warm, not like a corporate HR tool

---

## 5. Non-Goals

- No user authentication or login system
- No notifications or email alerts
- No job recommendations or external integrations
- No multi-user admin access
- No analytics beyond what is shown in the UI

---

## 6. Public Routes (`/`)

### Tab 1 — Dashboard

**Purpose:** Answer the two questions family members ask every day.

**Content (top to bottom):**
1. Greeting line — "Good morning" (time-aware)
2. Page title — "Your job hunt"
3. Hero card — today's application count (large), one motivational quote (rotates daily)
4. Two stat cards — this month's total count + interview count
5. Weekly bar chart — daily application count for the current week

**Motivational quotes — curated list (rotates daily by day of year):**
- "Every application is a step forward."
- "You only need one yes."
- "Rejection is redirection."
- "Progress, not perfection."
- "The right door is still out there."
- "Keep going — you're closer than you think."
- "One application at a time."
- "Showing up is already winning."
- "Every no clears the path to yes."
- "Your effort today is building tomorrow."

**Rules:**
- Today's count must be visible without scrolling on any mobile device
- Quote fades in after the hero number animates in
- Chart shows Mon–Sun of current week, today's bar in terracotta, rest in muted

---

### Tab 2 — Applications

**Purpose:** Show the full history of every job applied to, with current status.

**Content:**
- Page title — "Applications"
- Filter pills — All / Applied / Interview / Offer / Rejected
- Job cards — one per application, sorted by date descending (newest first)

**Each job card contains:**
- Company name (bold, 15px)
- Role / position (muted, 13px)
- Status badge (top right, colored pill)
- Date applied (bottom left, hint color, 11px)
- "View posting →" link (bottom right, terracotta, 11px) — opens URL in new tab

**Status badge colors:**

| Status | Background | Text |
|---|---|---|
| Applied | `#DBEAFE` | `#1D4ED8` |
| Interview | `#FEF3C7` | `#92400E` |
| Offer | `#DCFCE7` | `#166534` |
| Rejected | `#FFE4E6` | `#9F1239` |

**Empty state:**
- Centered, muted text: "No applications yet."
- Sub-line: "Check back soon."

---

## 7. Admin Route (`/admin`)

**Purpose:** Full control for the job hunter to log, edit, and manage everything.

**Sections:**

### Add Application
Form with these fields:
- Company name (text, required)
- Role / position (text, required)
- Job posting URL (url input, required)
- Date applied (date picker, defaults to today)
- Status (select: Applied / Interview / Offer / Rejected, defaults to Applied)
- Submit button — "Log application"

### Application List
- Same cards as public view
- Each card has Edit (pencil icon) and Delete (trash icon) buttons
- Edit opens an inline form pre-filled with existing data
- Delete shows a simple confirmation before removing

---

## 8. Motivational Quote Logic

- Quotes are stored as a hardcoded array in the frontend
- The active quote is selected by: `quotes[dayOfYear % quotes.length]`
- This gives one quote per day, cycling through the list
- No database involvement — pure frontend logic

---

## 9. Data Model

### jobs table

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key, auto-increment |
| company | TEXT | Required |
| role | TEXT | Required |
| url | TEXT | Required — job posting URL |
| date_applied | TEXT | ISO date string (YYYY-MM-DD) |
| status | TEXT | Applied / Interview / Offer / Rejected |
| created_at | TEXT | ISO timestamp, auto-set |

---

## 10. API Endpoints

| Method | Endpoint | Description | Used by |
|---|---|---|---|
| GET | `/api/jobs` | Get all jobs, sorted by date desc | Public + Admin |
| POST | `/api/jobs` | Add a new job | Admin |
| PATCH | `/api/jobs/:id` | Update a job's fields | Admin |
| DELETE | `/api/jobs/:id` | Delete a job | Admin |

---

## 11. Success Metrics

This is a personal tool. Success is simple:

- Family members stop asking "how many today?" because they check the app instead
- Job hunter logs every application within the same day
- App loads fast on mobile on a 4G connection

---
