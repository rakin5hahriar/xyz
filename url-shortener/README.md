# URL Shortener (minimal)

## What this includes
- Express backend
- MongoDB (Atlas) connection
- Register / Login (JWT)
- Create short URLs
- Redirect short URL -> original URL
- Basic analytics recorded per hit (ip, country, user-agent, referer, timestamp)

## Quick start

1. Install Node.js (v18+ recommended) and Git.
2. Extract the zip and open a terminal inside the project folder.

3. Copy `.env.example` to `.env` and fill values:
```
cp .env.example .env
# then edit .env and set MONGODB_URI, JWT_SECRET, BASE_URL
```

4. Install dependencies:
```
npm install
```

5. Start dev server:
```
npm run dev
```

6. Endpoints (use Postman / curl):
- `POST /api/auth/register` { email, password } -> returns `{ token }`
- `POST /api/auth/login` { email, password } -> returns `{ token }`
- `POST /api/urls` (auth) { originalUrl, customCode? } -> create short URL
- `GET /api/urls` (auth) -> list your URLs
- `GET /api/urls/:id/analytics` (auth) -> analytics summary
- `GET /:code` -> redirect to original URL (records analytics)

## Notes
- For geo lookups we use `geoip-lite` (bundled DB). Locally many hits show country `UNK`.
- Make sure `BASE_URL` in `.env` matches where you run the server (for local dev `http://localhost:3000`).
- Keep `JWT_SECRET` safe and long.
