# MyDesk · Invoice Management System

React 18 + Vite + Tailwind CSS invoicing app for freelancers and small studios.

## Setup

Install dependencies:
```bash
npm install
```

## Development

Start dev server (opens on http://localhost:5173):
```bash
npm run dev
```

## Build

Production bundle:
```bash
npm build
```

## Tech Stack

- **React 18** — UI framework
- **Vite** — Fast build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **localStorage** — Client-side state persistence (no backend)

## Features

- Dashboard with KPI metrics & activity feed
- Invoice CRUD operations
- Invoice editor with live preview
- Project tracking with milestones
- Client management
- Business settings & logo upload
- Print-to-PDF export
- Dark theme (Linear-inspired design system)

## Project Structure

```
app/
├── index.jsx              # Entry point
├── app.jsx                # Routing shell
├── store.jsx              # State management (useStore hook)
├── ui.jsx                 # Reusable primitives (Icon, Sidebar, Topbar, Modal)
├── styles.css             # Tailwind imports + custom theme
└── screens/
    ├── dashboard.jsx
    ├── invoices.jsx
    ├── invoice-detail.jsx
    ├── invoice-editor.jsx
    └── projects.jsx
```

## CSS

Styles use Tailwind CSS with a custom dark theme defined via CSS variables. Color palette is Linear-inspired with violet accents. See `tailwind.config.js` for theme tokens.

## Data

All app state is persisted to browser localStorage under the key `mydesk_invoicing_v1`. Reset data via the Settings screen.
