# track.it — App Flow

---

## Routes

| Route | Who sees it | Purpose |
|---|---|---|
| `/` | Everyone | Public view — dashboard, jobs |
| `/admin` | Job hunter only | Add, edit, delete jobs. |

No auth. No redirect. `/admin` is secret by URL alone.

---

## Public View — `/`

### Entry point

User opens the link. They land on the Dashboard tab. The bottom navigation is always visible.

```
User opens link
  → App loads
  → API call: GET /api/jobs
  → Dashboard renders with live data
```

### Bottom navigation

Two tabs. Always visible at the bottom. Switching tabs does not trigger a new API call — data is already loaded and shared across tabs.

```
Tab 1: Dashboard  (LayoutGrid icon)
Tab 2: Jobs       (List icon)
```

---

### Tab 1 — Dashboard flow

```
Dashboard mounts
  → Hero number animates from 0 to todayCount (600ms)
  → Quote fades in (400ms delay)
  → Stat cards stagger in (50ms apart)
  → Chart card renders with this week's data
```

**Data computed client-side from the jobs array:**
- Today's count: filter by `date_applied === today`
- Month count: filter by `date_applied.startsWith(thisMonth)`
- Interview count: filter by `status === 'Interview'` + this month
- Week chart: count by each Mon–Sun date

No extra API calls. Everything derived from the single jobs fetch.

---

### Tab 2 — Jobs flow

```
User taps Jobs tab
  → Jobs list renders from existing data (no new API call)
  → Filter pills: All (default) / Applied / Interview / Offer / Rejected
  → User taps a filter pill
    → List re-renders with filtered jobs
  → User taps "View posting →" on a card
    → Opens URL in new tab
```

**Filter state:** Local component state. `useState('All')`. No URL params needed.

---

## Admin View — `/admin`

Admin page is a single scrollable page. No tabs. Sections from top to bottom:

1. Header — "track.it admin"
2. Add application form
3. Current applications list (with edit/delete)

### Add application flow

```
Admin fills form:
  Company name   (text)
  Role           (text)
  Job posting URL (url)
  Date applied   (date, defaults to today)
  Status         (select, defaults to "Applied")

Admin taps "Log application"
  → Validation: all fields required
  → If invalid: inline error on empty fields
  → If valid:
    → POST /api/jobs
    → On success: form clears, new job appears at top of list
    → On error: show error message
```

### Edit application flow

```
Admin taps pencil icon on a job card
  → Card expands to show inline edit form
  → Fields pre-filled with existing data
  → Admin changes what they need
  → Taps "Save"
    → PATCH /api/jobs/:id
    → On success: card collapses, shows updated data
    → Status badge animates (scale pop)
  → Taps "Cancel"
    → Card collapses, no changes
```

### Delete application flow

```
Admin taps trash icon on a job card
  → Inline confirmation appears on the card:
    "Delete this application?"
    [Yes, delete]  [Cancel]
  → Admin taps "Yes, delete"
    → DELETE /api/jobs/:id
    → Card removed from list with fade-out animation
  → Admin taps "Cancel"
    → Confirmation disappears, card stays
```

## Error States

| Scenario | What happens |
|---|---|
| API unreachable on load | Skeleton cards remain, small error banner: "Could not load data." |
| Add job fails | Form stays filled, error message below submit button |
| Delete fails | Job stays in list, brief error message on card |
| Job posting URL invalid | Inline validation error on URL field |

---

## Loading States

| Scenario | Loading treatment |
|---|---|
| Initial page load | Skeleton cards in place of real cards |
| Add job submitting | Button shows spinner, disabled |
| Delete confirming | Button shows spinner, disabled |

---

## Data Flow Diagram

```
App loads
  ├── GET /api/jobs  ────────────────► jobs array (shared state)
  │                                    ├── Dashboard: todayCount, monthCount, weekData
  │                                    ├── Jobs tab: full list + filter
  │                                    └── Admin: editable list

Admin actions
  ├── POST /api/jobs     → prepend to jobs array
  ├── PATCH /api/jobs/:id → update item in jobs array
  ├── DELETE /api/jobs/:id → remove from jobs array
```

All state lives in the root `App.jsx` component and is passed down via props. No Redux, no context needed — the data is simple and the tree is shallow.

---

## Mobile UX Rules

1. **Every screen answers its question above the fold.** Today's count — visible instantly. Month count — visible instantly. No scroll required.

2. **Bottom nav is always visible.** Fixed position. Never hidden behind content.

3. **Tap targets are minimum 44px.** No tiny buttons. No cramped filter pills.

4. **Tab switches are instant.** Data is already loaded. No loading state on tab switch.

5. **Forms are thumb-friendly.** Inputs are tall (44px+). Buttons are full width. The keyboard does not cover the submit button.
