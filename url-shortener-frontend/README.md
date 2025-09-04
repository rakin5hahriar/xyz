# URL Shortener (Frontend)

This is a Vite + React + Tailwind frontend for the URL Shortener backend.

## Quick start

1. Copy `.env.example` to `.env` and set `VITE_API_BASE` to your backend base (e.g. `http://localhost:3000`).
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev:
   ```
   npm run dev
   ```
4. Open the URL shown by Vite (usually http://localhost:5173).

## Features
- Register & Login (stores JWT in localStorage)
- Create short URLs
- List your URLs
- View analytics for each URL (country & last 7 days)
