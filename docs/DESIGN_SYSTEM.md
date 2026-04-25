# track.it — Design System

---

## Philosophy

Every design decision in track.it serves one principle: **the person using this app should feel seen, not tracked.**

The numbers are accomplishments. The interface is a companion. Nothing is decorative. If an element cannot justify its existence, it is removed.

---

## Colors

### Base Palette

```css
--color-bg-page:       #F5F0EB;  /* Warm off-white — page background */
--color-bg-card:       #FFFFFF;  /* All cards and surfaces */
--color-bg-hero:       #C2622D;  /* Hero stat card — terracotta */
--color-bg-dark:       #1C1917;  /* Streak card, dark accents */

--color-text-primary:  #1C1917;  /* Main text, headings, numbers */
--color-text-muted:    #78716C;  /* Secondary labels, role text */
--color-text-hint:     #A8A29E;  /* Dates, timestamps, tertiary */
--color-text-hero:     #FFFFFF;  /* Text on hero card */

--color-border:        #E5DDD6;  /* All card borders, dividers */
--color-accent:        #C2622D;  /* Buttons, active nav, links */
--color-bar-inactive:  #E8DDD5;  /* Inactive chart bars */
```

### Status Badge Colors

```css
/* Applied */
--badge-applied-bg:    #DBEAFE;
--badge-applied-text:  #1D4ED8;

/* Interview */
--badge-interview-bg:  #FEF3C7;
--badge-interview-text:#92400E;

/* Offer */
--badge-offer-bg:      #DCFCE7;
--badge-offer-text:    #166534;

/* Rejected */
--badge-rejected-bg:   #FFE4E6;
--badge-rejected-text: #9F1239;
```

---

## Typography

**Font:** DM Sans — import from Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Scale

| Role | Size | Weight | Letter Spacing | Usage |
|---|---|---|---|---|
| Hero number | `clamp(56px, 14vw, 72px)` | 700 | default | Today's count on hero card |
| Page title | `20px` | 700 | default | "Your job hunt", "Applications" |
| Card heading | `15px` | 600 | default | Company name on job card |
| Subheading | `14px` | 400 | default | Role/position, quote text |
| Body | `13px` | 400 | default | General body text |
| Label | `11px` | 500 | `0.06em` | ALL CAPS labels only |
| Hint | `11px` | 400 | default | Dates, timestamps |

### Rules
- ALL CAPS labels always have `letter-spacing: 0.06em` — no exceptions
- Never more than two weights competing on a single card
- Numbers use `font-variant-numeric: tabular-nums` to prevent width jumping
- `line-height: 1.4` for body text, `1.1` for hero numbers

---

## Spacing

**Base unit:** 4px

| Token | Value | Usage |
|---|---|---|
| `space-xs` | `4px` | Tight gaps, inline elements |
| `space-sm` | `8px` | Icon-to-text gap, badge padding |
| `space-md` | `12px` | Gap between cards |
| `space-lg` | `16px` | Card internal padding, page horizontal padding |
| `space-xl` | `20px` | Hero card padding |
| `space-2xl` | `24px` | Section spacing |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | `8px` | Small elements, filter pills |
| `radius-md` | `12px` | Buttons |
| `radius-lg` | `16px` | Cards, stat cards, chart card |
| `radius-xl` | `20px` | Hero card |
| `radius-full` | `9999px` | Status badges, nav dots |

---

## Shadows

No decorative shadows. Depth is created through background color contrast (white card on `#F5F0EB` page), not drop shadows.

Only exception: focus ring on inputs — `box-shadow: 0 0 0 2px #C2622D40`

---

## Components

### Hero Card
```
Background:    #C2622D
Border radius: 20px
Padding:       20px
Text color:    white

Contents (top to bottom):
  Label:   "JOBS APPLIED TODAY" — 11px, 500, letter-spacing 0.06em, opacity 0.8
  Number:  clamp(56px, 14vw, 72px), weight 700, line-height 1
  Quote:   13px, weight 400, opacity 0.75, margin-top 8px
```

### Stat Card
```
Background:    #FFFFFF
Border:        0.5px solid #E5DDD6
Border radius: 16px
Padding:       14px

Contents:
  Label:  11px, 500, uppercase, letter-spacing 0.06em, color #78716C
  Value:  28px, weight 700, color #1C1917, line-height 1
  Hint:   11px, 400, color #A8A29E, margin-top 2px
```

### Job Card
```
Background:    #FFFFFF
Border:        0.5px solid #E5DDD6
Border radius: 16px
Padding:       14px 16px

Layout:
  Top row:    Company name (left) + Status badge (right)
  Mid row:    Role / position
  Bottom row: Date applied (left) + "View posting →" (right)
```

### Status Badge
```
Font size:      10px
Font weight:    600
Letter spacing: 0.06em
Text transform: uppercase
Padding:        3px 8px
Border radius:  9999px (pill)
Colors:         See status badge colors above
```

### Chart Card
```
Background:    #FFFFFF
Border:        0.5px solid #E5DDD6
Border radius: 16px
Padding:       14px

Bar height:    60px total track height
Bar color:     #E8DDD5 inactive, #C2622D for today
Bar radius:    4px
Gap between bars: 5px
Day labels:    9px, color #A8A29E, centered below bar
```

### Bottom Navigation
```
Background:    #FFFFFF
Border top:    0.5px solid #E5DDD6
Height:        70px (includes safe area bottom padding)
Layout:        3 equal-width items

Each nav item:
  Icon:        20px, Lucide React
  Label:       10px, weight 500, letter-spacing 0.03em
  Active:      icon + label color #C2622D, small dot (4px circle) below label
  Inactive:    icon + label color #A8A29E
```

### Buttons
```
Primary:
  Background:    #C2622D
  Text:          white
  Font:          13px, weight 600
  Border radius: 12px
  Padding:       12px
  Width:         full width

Outline:
  Background:    transparent
  Border:        1.5px solid #C2622D
  Text:          #C2622D
  Font:          13px, weight 600
  Border radius: 12px
  Padding:       12px
  Width:         full width
```

### Form Inputs (Admin)
```
Background:    #FFFFFF
Border:        1px solid #E5DDD6
Border radius: 12px
Padding:       12px 14px
Font size:     14px
Color:         #1C1917
Focus border:  #C2622D
Focus shadow:  0 0 0 2px #C2622D40
Placeholder:   color #A8A29E
```

---

## Motion

All animations use **Framer Motion**.

### Hero Number Count-Up
```
Animate from 0 to actual count
Duration: 600ms
Easing: easeOut
Trigger: on page load
```

### Quote Fade-In
```
Animate: opacity 0 → 1
Duration: 400ms
Delay: 500ms (after number finishes)
Easing: easeOut
```

### Card Stagger on Load
```
Each card: opacity 0 → 1, y: 12px → 0
Duration: 300ms per card
Stagger delay: 50ms between cards
Easing: easeOut
```

### Tab Transition
```
Outgoing: opacity 1 → 0, x: 0 → -10px, duration 150ms
Incoming: opacity 0 → 1, x: 10px → 0, duration 200ms
Easing: easeOut
```

### Status Badge Update
```
Scale: 1 → 1.05 → 1
Duration: 150ms
Trigger: when status prop changes
```

---

## Iconography

**Library:** Lucide React  
**Stroke width:** 1.5px (Lucide default)

| Icon | Lucide name | Size | Usage |
|---|---|---|---|
| Dashboard tab | `LayoutGrid` | 20px | Bottom nav |
| Jobs tab | `List` | 20px | Bottom nav |
| Edit | `Pencil` | 16px | Admin job card |
| Delete | `Trash2` | 16px | Admin job card |
| External link | `ExternalLink` | 12px | "View posting →" |

Flame emoji 🔥 — one deliberate exception, used for streak display only. Warm and personal.

---

## Touch Targets

All interactive elements must have a minimum touch target of **44 × 44px** — Apple and Google HIG standard.

- Bottom nav items: full height of nav bar, 1/3 width
- Job card action buttons (edit/delete): 44px minimum hit area, even if icon is smaller
- Filter pills: minimum 36px height, adequate horizontal padding

---

## Empty States

| Screen | Empty state text | Sub-line |
|---|---|---|
| Jobs tab (no applications) | "No applications yet." | "Check back soon." |
| Admin — no jobs | "No applications logged." | "Add your first one above." |

Empty state text: centered, `color-text-muted`, 14px, no illustration.

---

## Loading States

Skeleton cards — same dimensions as real cards, background `#F0EAE3`, animated shimmer left to right.

```css
@keyframes shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

background: linear-gradient(90deg, #F0EAE3 25%, #E8DDD5 50%, #F0EAE3 75%);
background-size: 400px 100%;
animation: shimmer 1.4s ease infinite;
```

---

## The One Rule

**The numbers are the foreground. Everything else is background.**

If your eye does not land on the big stat first when you open the dashboard, something has stolen focus that should not have. Every design decision traces back to this.
