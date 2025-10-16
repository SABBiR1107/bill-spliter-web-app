# Spliter1 — Bill Spliter Web App

[Live demo (Vercel)](https://spliter1.vercel.app) • [Source code](https://github.com/SABBiR1107/bill-spliter-web-app)

---

A simple, modern web app to manage and split group expenses during trips, events, or shared households. Build features include user authentication, group creation (QR/join code), activity and expense creation, and clear per-person balances.

## Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech stack](#tech-stack)
* [Screenshots](#screenshots)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Clone & Install](#clone--install)
  * [Environment variables](#environment-variables)
  * [Run locally](#run-locally)
  * [Build & Deploy](#build--deploy)
* [Project structure](#project-structure)
* [API / Backend](#api--backend)
* [Testing](#testing)
* [Contributing](#contributing)
* [License](#license)
* [Credits](#credits)

---

## Demo

Open the live app at: [https://spliter1.vercel.app](https://spliter1.vercel.app)

## Features

* User sign up / sign in (email, social providers depending on configuration)
* Create / join groups using QR or join codes
* Add activities and attach expenses to activities
* Track who paid what and automatic per-person balance calculation
* Dashboard showing both group and individual balances
* Edit and delete expenses and activities
* Responsive UI for mobile and desktop

## Tech stack

* Frontend: Next.js (React)
* Styling: Tailwind CSS (or CSS Modules / Chakra / UI lib depending on repo)
* Backend: (if present) Node / Express / Next API routes / Firebase / Supabase — check the repository for the actual provider
* Database: (depends) PostgreSQL / MongoDB / Supabase / Firebase
* Deployment: Vercel

> NOTE: The exact backend/database provider is determined by the repository configuration. If you plan to use Supabase or Firebase, add the required environment variables (see below).

## Screenshots

> Replace these placeholders with real screenshots from `/public` or the app when you have them.

* Dashboard view
* Group details with expenses
* Add expense modal

---

## Getting Started

### Prerequisites

* Node.js 18+ (LTS recommended)
* npm or yarn
* (Optional) A provider account if the app uses Supabase / Firebase / Auth0 etc.

### Clone & Install

```bash
# clone the repo
git clone https://github.com/SABBiR1107/bill-spliter-web-app.git
cd bill-spliter-web-app

# install dependencies
npm install
# or
# yarn install
```

### Environment variables

Create a `.env.local` file in the project root and add the variables required by the project. Example variables you may need to set (adjust names to match the repo):

```
NEXT_PUBLIC_APP_NAME="Spliter1"
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Auth provider (Supabase / Firebase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Or Firebase env variables
# FIREBASE_API_KEY=
# FIREBASE_AUTH_DOMAIN=
# ...

# Optional: Vercel analytics or SENTRY/CONSOLE keys
```

> Check `next.config.js`, `.env.example`, or the README inside the repository for the exact variables required.

### Run locally

```bash
# development
npm run dev
# or
# yarn dev

# open http://localhost:3000
```

### Build & Deploy

```bash
# build for production
npm run build
# start prod locally
npm start
```

The app is ready to deploy to Vercel — connect your GitHub repo to Vercel and push to `main` or `master`. Add the same environment variables in the Vercel dashboard.

---

## Project structure

```
/ (root)
├─ public/             # static assets and screenshots
├─ src/ or pages/      # Next.js pages or app router
├─ components/         # React components (Header, Dashboard, ExpenseForm...)
├─ styles/             # global styles / Tailwind config
├─ lib/                # api clients, helpers (supabaseClient.js etc.)
├─ prisma/ or migrations/# database schema (if present)
├─ package.json
└─ README.md
```

## API / Backend

If the project uses Next API routes they will be under `/pages/api` or `/app/api`. If the app integrates with Supabase/Firebase the repository will usually include an initialisation file (e.g. `lib/supabase.js` or `lib/firebase.js`).

Key endpoints and functions to look for:

* `POST /api/auth/*` — sign up / sign in
* `GET /api/groups` — list groups
* `POST /api/groups` — create a group
* `POST /api/groups/:id/expenses` — add expense
* `GET /api/groups/:id/balances` — compute group balances

If you want, I can open the repo and create specific docs for each endpoint.

---

## Testing

If the repository contains tests, they will usually run with:

```bash
npm test
# or
npm run test
```

Add unit tests for balance calculations and components that render totals — those are the most critical pieces to keep correct.

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/clear-balances`)
3. Commit your changes (`git commit -m "feat: add clear balances feature"`)
4. Push to the branch (`git push origin feat/clear-balances`)
5. Open a pull request

Please follow existing code style and include tests for new logic.

---

## License

This project is open-source. Add a LICENSE file (MIT recommended) or change to your preferred license.

```
MIT License

Copyright (c) YEAR SABBiR1107

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

... (standard MIT text)
```

## Credits

* Author / Maintainer: SABBiR1107
* Inspired by: Splitwise and other expense-splitting apps

---

If you'd like, I can:

* Tailor this README to the exact code in the repository (I can inspect files and add specific env names, scripts, and screenshots).
* Create a `CONTRIBUTING.md` and `ISSUE_TEMPLATE.md`.
* Generate a short demo GIF to include under the screenshots section.
