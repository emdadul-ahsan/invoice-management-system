# Invoice Management System — Project Summary

> A two-track design exploration for a freelancer/small-studio invoicing tool, code-named **MyDesk**. The project contains an early low-fidelity wireframe study and a working high-fidelity React prototype built on a dark, Linear-inspired UI system.

---

## 1. Project at a glance

| | |
|---|---|
| **Project name** | Invoice Management System |
| **Product code-name** | MyDesk · Invoicing |
| **Target user** | Solo freelancers and small studios who bill clients for project work, retainers, and milestone-based engagements |
| **Two artifacts** | (1) `Invoice System Wireframes.html` — low-fi exploration · (2) `app/` — hi-fi React prototype |
| **Stack** | Plain HTML + React 18 (via Babel standalone) + localStorage. No build step, no backend. |
| **Persistence** | All app state is saved to the browser under the key `mydesk_invoicing_v1` |

---

## 2. Repository layout

```
.
├── Invoice System Wireframes.html   ← low-fi sketch deck (5 screens × 3 variants)
├── SUMMARY.md                       ← this file
└── app/                             ← working hi-fi prototype
    ├── index.html                   ← entry · loads React + babel + all jsx scripts
    ├── styles.css                   ← Linear-inspired dark design system (~724 lines)
    ├── store.jsx                    ← localStorage-backed state + seed data
    ├── ui.jsx                       ← shared primitives (Sidebar, Topbar, Icon, Modal…)
    ├── app.jsx                      ← routing shell, Clients + Settings screens, mount
    └── screens/
        ├── dashboard.jsx
        ├── invoices.jsx
        ├── invoice-detail.jsx
        ├── invoice-editor.jsx
        └── projects.jsx
```

---

## 3. The wireframe exploration

`Invoice System Wireframes.html` is a single-page low-fidelity board. It explores **5 screens, with 3 variant directions each**, presented hand-drawn-style on a warm paper background with violet accents. Each variant carries an "idx" tag (e.g. `01.A`) and a one-word vibe label.

### Screen 01 · Dashboard — *"answer 'what should I do today' in < 3 seconds"*
- **A · Classic Strip** *(safe pick)* — left rail nav, top bar, 4 KPI cards, monthly income line chart, status mix tile, recent activity feed.
- **B · Focus Mode** *(opinionated)* — one giant headline number ("you'll receive this month"), two secondary KPIs, then a today's-queue task list with inline actions (remind / open / draft).
- **C · Cashflow Timeline** *(spicy)* — three cleared/in-flight/at-risk tiles plus a vertical 30-day timeline of expected incoming payments, with a recurring-subscriptions footer.

### Screen 02 · Invoice List — *"scan many, act on one, find anything fast"*
- **A · Dense Table** *(power-user)* — filter pills, sortable table with status pill as the rightmost (scannable) column.
- **B · Kanban by Status** *(visual flow)* — Draft / Pending / Overdue / Paid columns with draggable cards.
- **C · Grouped by Client** *(relationship-first)* — client cards with lifetime value, retainer progress, and invoice chips.

### Screen 03 · Invoice Editor — *"from blank to 'ready to send' without leaving the page"*
- **A · Form + Live Preview** *(obvious)* — split layout, form left, paper-style preview right.
- **B · Guided Stepper** *(first-timer)* — 5-step wizard with slash-command tips.
- **C · Type-on-Doc** *(notion-y)* — edit directly on the invoice document with inline placeholders.

### Screen 04 · Invoice Detail (Paid) and Screen 05 · Milestone Project
Three variants each, exploring layouts for paid-receipt confirmation, audit trail, and milestone-based project tracking with deliverable checklists and progress bars.

The wireframes also include a small **Tweaks** panel (fixed bottom-right) for toggling between rough sketch mode and a "crisp" mode, plus a monochrome toggle that strips the violet accent.

---

## 4. The hi-fi prototype (`app/`)

A working React 18 single-page app with hash-based routing.

### Routes / screens
- `#/dashboard` — KPI cards, income, action queue
- `#/invoices` — searchable, filterable list of invoices
- `#/invoice-detail/:id` — invoice viewer with full activity log
- `#/editor/:id?` — invoice editor (create + edit)
- `#/projects` — project list
- `#/project-detail/:id` — single project with milestones
- `#/clients` — client cards (lifetime value, outstanding, invoices count)
- `#/settings` — business info, logo upload, demo-data reset

### App architecture
- **`app.jsx`** — `<App>` parses `window.location.hash` into `{name, params}` and renders the matching screen inside a `<Shell>` (Sidebar + Topbar + crumbs). It also hosts the **Clients** and **Settings** screens inline.
- **`store.jsx`** — `StoreProvider` exposes a hand-rolled store via `useStore()`. State is loaded from `localStorage` under `mydesk_invoicing_v1` and rewritten on every mutation. Exposes domain helpers like `invoiceTotal`, `invoicesByClient`, plus mutators (`createClient`, `updateClient`, `deleteClient`, `updateBusiness`, `resetData`, `toast`).
- **`ui.jsx`** — shared primitives: `<Sidebar>`, `<Topbar>`, `<Icon>`, `<Modal>`, formatters (`fmtMoney`).
- **`screens/*.jsx`** — one file per major screen.

### Domain model (from seed data)
- **Clients** — `{id, name, email, addr, color}`
- **Invoices** — `{id, number, clientId, project, issued, due, status, paidOn?, method?, ref?, items[], notes, activity[]}`
  - `status ∈ {draft, pending, overdue, paid}`
  - `items[]` — `{id, desc, qty, rate}`
  - `activity[]` — append-only log: `created → sent → opened → reminder → paid`
- **Projects** — `{id, name, clientId, total, currency, milestones[]}`
  - `milestones[]` — `{id, title, amount, status, invoiceId, due}`
- **Business** — solo-studio profile (name, email, addr, phone, logo as base64 data URL)

### Settings & data
- Logo upload accepts PNG/JPG/SVG up to **1.5 MB**, stored as a data URL on the business record.
- A **Reset demo data** button wipes localStorage and re-seeds from the bundled sample dataset (5 clients, ~6 invoices, projects with milestones).

---

## 5. Design system

The hi-fi app uses a custom, **Linear-inspired dark theme** defined entirely in `styles.css` as CSS custom properties.

### Palette
- **Surfaces** — `--pitch-black #08090a` → `--graphite #0f1011` → `--deep-slate #161718` → `--charcoal-grey #23252a`
- **Text** — `--porcelain #f7f8f8` (primary), `--light-steel`, `--storm-cloud`, `--fog-grey` (4-step contrast ramp)
- **Brand accent** — `--aether-blue #5e6ad2` (the Linear-ish violet)
- **Semantic** — `--emerald #27a644` (paid/ok), `--warning-red #eb5757` (overdue), `--cyan-spark #02b8cc` (info), `--amber #d4a017` (pending)
- **Pop accent** — `--neon-lime #e4f222` (reserved for callouts)

### Typography
- **Display + body** — Inter (400/500/600/700)
- **Mono** — JetBrains Mono (numbers, invoice IDs, references)

### Tokens
- **Radii** — 6px buttons/inputs, 12px cards, 16px large cards, 9999px pills
- **Shadows** — layered system: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, plus `--shadow-card` and `--shadow-button-primary` for the Linear-style 1px inner highlight

### Wireframe aesthetic (separate, lo-fi only)
The wireframe doc uses a totally different look: warm paper `#fbfaf7`, hand-drawn fonts (Kalam, Caveat), violet `#7b68ee` accents, and dashed/scribbled placeholders. This is intentional — the two artifacts speak different languages on purpose so they aren't confused.

---

## 6. What's in the prototype today

- ✅ Routing across 8 screens
- ✅ CRUD-style flows for clients (modal-driven add/edit/delete)
- ✅ Invoice editor + detail view
- ✅ Project view with milestones
- ✅ Business profile + logo upload
- ✅ localStorage persistence + reset
- ✅ Toast notifications (`store.toast(msg, kind)`)
- ✅ Search input wired through `Shell` → screens

## 7. Suggested next steps

1. **Bulk actions on invoice list** — multi-select to send reminders / mark paid.
2. **Recurring invoices** — wireframe screen 01.C teases this; not in the prototype yet.
3. **PDF/print view** — currently no export; the detail view is the closest we have.
4. **Email-style send flow** — today, "send" only changes status; no compose modal.
5. **Pick a wireframe direction per screen** — the lo-fi study has 3 variants of each; the hi-fi prototype has tacitly chosen one of each. Worth a formal review.
6. **Tighten empty states** — a fresh-reset user should see onboarding affordances, not bare grids.

---

*Last updated: May 25, 2026*
